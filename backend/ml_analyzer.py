import spacy
from spacy.matcher import PhraseMatcher
import json
import pickle
import PyPDF2
from sklearn.metrics.pairwise import cosine_similarity
import os

from models import JobMatch, ScoreBreakdown, CourseRecommendation, LearningPathStep, CVAnalysisResult
from job_feed_loader import load_job_dataset as load_job_feed_dataset

# Construct path to ML models
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "ml_models")

# 1. Load ML models and JSON data ONCE globally (cached)
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("WARNING: en_core_web_sm model not found. Proceeding without NLP.")
    nlp = None

sbert_model = None
_sbert_load_attempted = False

def get_sbert_model():
    global sbert_model, _sbert_load_attempted
    if _sbert_load_attempted:
        return sbert_model

    _sbert_load_attempted = True
    try:
        from sentence_transformers import SentenceTransformer
        sbert_model = SentenceTransformer('all-MiniLM-L6-v2')
    except Exception as e:
        print(f"WARNING: SentenceTransformer not loaded. {e}")
        sbert_model = None
    return sbert_model

try:
    skill_model = pickle.load(open(os.path.join(MODELS_DIR, "skill_model.pkl"), "rb"))
    tfidf = pickle.load(open(os.path.join(MODELS_DIR, "tfidf.pkl"), "rb"))
    mlb = pickle.load(open(os.path.join(MODELS_DIR, "mlb.pkl"), "rb"))
except Exception as e:
    print(f"WARNING: ML pickle files not loaded. {e}")
    skill_model = tfidf = mlb = None

try:
    with open(os.path.join(MODELS_DIR, "courses.json"), "r", encoding="utf-8") as f:
        courses_data = json.load(f)
except Exception as e:
    print(f"WARNING: courses.json not loaded. {e}")
    courses_data = {}

def extract_skills(cv_text):
    if not nlp or not courses_data:
        return []
        
    skills_list = list(courses_data.keys())
    matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
    patterns = [nlp(skill) for skill in skills_list]
    matcher.add("SKILLS", patterns)
    
    doc = nlp(cv_text)
    matches = matcher(doc)
    
    synonyms = {"EDR": "endpoint security", "endpoint security": "EDR"}
    found_skills = set([doc[start:end].text for _, start, end in matches])
    
    # Normalize cases based on courses.json keys
    normalized_skills = set()
    skill_map = {k.lower(): k for k in skills_list}
    
    for s in list(found_skills):
        s_lower = s.lower()
        if s_lower in skill_map:
            normalized_skills.add(skill_map[s_lower])
        if s in synonyms:
            syn_lower = synonyms[s].lower()
            if syn_lower in skill_map:
                normalized_skills.add(skill_map[syn_lower])
                
    return list(normalized_skills)

def predict_required_skills(job_description):
    if not skill_model or not tfidf or not mlb:
        return []
    X = tfidf.transform([job_description])
    y_pred = skill_model.predict(X)
    return list(mlb.inverse_transform(y_pred)[0])

def calculate_semantic_score(cv_text, job_description):
    model = get_sbert_model()
    if not model:
        return 0.0
    emb = model.encode([cv_text, job_description])
    score = cosine_similarity([emb[0]], [emb[1]])[0][0]
    return round(max(0.0, float(score) * 100), 2)

def calculate_skill_match(cv_skills, required_skills):
    if not required_skills:
        return 0.0
    matched = len(set(cv_skills) & set(required_skills))
    return round((matched / len(required_skills)) * 100, 2)

def calculate_final_score(cv_text, job_desc, cv_skills, required_skills):
    semantic = calculate_semantic_score(cv_text, job_desc)
    skill_match = calculate_skill_match(cv_skills, required_skills)
    final = 0.3 * semantic + 0.7 * skill_match
    return round(final, 2), semantic, skill_match

def get_missing_skills(cv_skills, required_skills):
    return [s for s in required_skills if s not in cv_skills]

def get_course_recommendations(missing_skills):
    result = []
    for skill in missing_skills:
        if skill in courses_data:
            result.append(CourseRecommendation(
                skill=skill,
                course_name=courses_data[skill]["name"],
                platform=courses_data[skill]["platform"],
                link=courses_data[skill]["link"]
            ))
    return result

def course_impact_analysis(current_score, missing_skills):
    if not missing_skills:
        return []
    core_skills = {"Python", "Linux", "Windows", "SOC", "SIEM", "EDR", "NGFW", "penetration testing"}
    impact_result = []
    temp = current_score
    for skill in missing_skills:
        impact = 7.0 if skill in core_skills else 4.0
        temp = min(temp + impact, 100.0)
        impact_result.append(LearningPathStep(
            skill=skill,
            after_learning_score=round(temp, 1),
            increase=impact
        ))
    return impact_result

def extract_text_from_pdf(file_obj):
    text = ""
    reader = PyPDF2.PdfReader(file_obj)
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

_cached_dataset = None

def load_job_dataset():
    global _cached_dataset
    if _cached_dataset is not None:
        return _cached_dataset

    data = load_job_feed_dataset()
    for item in data:
        desc = item.get("description", "")
        item["_cached_required_skills"] = predict_required_skills(desc)

    _cached_dataset = data
    return _cached_dataset

def analyze_cv_full(cv_file_obj, filename: str, target_category: str = "cybersecurity"):
    dataset = load_job_dataset()
    cv_text = extract_text_from_pdf(cv_file_obj)
    cv_skills = extract_skills(cv_text)
    
    results = []
    for item in dataset:
        job_desc = item.get("description", "")
        # Use precomputed skills if available, otherwise predict
        required = item.get("_cached_required_skills")
        if required is None:
            required = predict_required_skills(job_desc)
            
        final_score, semantic, skill_match = calculate_final_score(cv_text, job_desc, cv_skills, required)
        missing = get_missing_skills(cv_skills, required)
        matched = [s for s in required if s in cv_skills]
        courses = get_course_recommendations(missing)
        impact = course_impact_analysis(final_score, missing)
        
        job_id = str(item.get("id", ""))
        title = item.get("title_normalized_en") or item.get("title_original") or "Unknown"
        company = item.get("company") or "Unknown"
        location = item.get("location") or "Bakı"
        url = item.get("url")
        
        results.append(JobMatch(
            job_id=job_id,
            title=title,
            company=company,
            location=location,
            match_percentage=final_score,
            scores=ScoreBreakdown(final=final_score, skill_match=skill_match, semantic=semantic),
            matched_skills=matched,
            missing_skills=missing,
            cv_skills=cv_skills,
            required_skills=required,
            courses=courses,
            learning_path=impact,
            url=url
        ))
        
    # Sort and take top 5 for Deep LLM Analysis
    results.sort(key=lambda x: x.match_percentage, reverse=True)
    top_5 = results[:5]
    
    # Run Deep LLM Refinement on top 5
    from cv_analyzer import deep_analyze_job_matches
    refined_top_matches = deep_analyze_job_matches(cv_text, top_5)
    
    # Pick the absolute best Top 3 matches based on the LLM's assessment
    top_matches = refined_top_matches[:3]
    
    overall_score = top_matches[0].match_percentage if top_matches else 0.0
    
    return CVAnalysisResult(
        filename=filename,
        target_category=target_category,
        extracted_skills=cv_skills,
        overall_score=overall_score,
        top_matches=top_matches,
        summary="" # Will be populated by Llama
    )
    
def filter_for_free_tier(analysis_result: CVAnalysisResult) -> CVAnalysisResult:
    # Filter the results for the free tier
    # Strip some features out from the result instance
    for match in analysis_result.top_matches:
        match.scores = None
        match.cv_skills = None
        match.required_skills = None
        match.courses = None
        match.learning_path = None
        # Only show up to 3 missing skills
        match.missing_skills = match.missing_skills[:3]
        
    analysis_result.extracted_skills = [] # Hide extracted skills 
    return analysis_result
