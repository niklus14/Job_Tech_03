import json
import os
import re
from typing import List, Tuple
from PyPDF2 import PdfReader
from groq import Groq
from dotenv import load_dotenv
from models import JobMatch, CVAnalysisResult, SkillRecommendation, AIRecommendationResult, ScoreBreakdown

load_dotenv()

# ─── Skill keyword banks per category ───
SKILL_KEYWORDS = {
    "cybersecurity": [
        "cybersecurity", "security", "siem", "soar", "edr", "soc", "nist",
        "iso 27001", "mitre", "firewall", "ids", "ips", "penetration testing",
        "vulnerability", "incident response", "threat", "malware", "encryption",
        "cryptography", "gdpr", "pci dss", "risk management", "compliance",
        "network security", "endpoint", "dlp", "pam", "nac", "dns security",
        "forensics", "audit", "information security", "cissp", "cism", "ceh",
        "oscp", "cciso", "grc", "vendor management", "scripting", "python",
        "linux", "windows", "tcp/ip", "vpn", "ssl", "tls", "wireshark",
        "splunk", "kali", "nessus", "burp suite", "metasploit"
    ],
    "ml": [
        "machine learning", "deep learning", "neural network", "tensorflow",
        "pytorch", "keras", "scikit-learn", "nlp", "natural language processing",
        "computer vision", "reinforcement learning", "regression", "classification",
        "clustering", "feature engineering", "model training", "data pipeline",
        "mlops", "python", "r", "jupyter", "pandas", "numpy", "matplotlib",
        "statistics", "probability", "linear algebra", "calculus", "data science",
        "ai", "artificial intelligence", "transformers", "bert", "gpt",
        "hugging face", "aws sagemaker", "google cloud ml", "azure ml",
        "sql", "big data", "spark", "hadoop", "docker", "kubernetes", "git"
    ],
    "fullstack": [
        "javascript", "typescript", "react", "angular", "vue", "node.js",
        "express", "next.js", "html", "css", "sass", "tailwind", "bootstrap",
        "rest api", "graphql", "mongodb", "postgresql", "mysql", "redis",
        "docker", "kubernetes", "aws", "azure", "gcp", "ci/cd", "git",
        "github", "agile", "scrum", "python", "django", "flask", "fastapi",
        "java", "spring", "c#", ".net", "php", "laravel", "ruby", "rails",
        "webpack", "vite", "testing", "jest", "cypress", "responsive design",
        "figma", "ui/ux", "sql", "nosql", "firebase", "vercel", "netlify"
    ],
    "data_analysis": [
        "data analysis", "sql", "excel", "power bi", "tableau", "python",
        "pandas", "numpy", "matplotlib", "seaborn", "statistics", "r",
        "data visualization", "etl", "data warehouse", "data modeling",
        "business intelligence", "reporting", "dashboard", "kpi",
        "data cleaning", "data wrangling", "a/b testing", "hypothesis testing",
        "regression", "correlation", "google analytics", "looker", "dax",
        "pivot table", "vba", "jupyter", "bigquery", "snowflake", "redshift",
        "apache airflow", "data governance", "data quality"
    ]
}

# ─── Load job dataset ───
from job_feed_loader import load_job_dataset


def extract_text_from_pdf(file_path: str) -> str:
    """Extract text content from a PDF file."""
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text


def extract_skills_from_cv(cv_text: str, category: str) -> List[str]:
    """
    Extract skills from CV text by matching against category keyword bank.
    This is the template — in production, the LLM model would do this more intelligently.
    """
    cv_lower = cv_text.lower()
    keywords = SKILL_KEYWORDS.get(category, [])
    found_skills = []
    for keyword in keywords:
        # Use word boundary matching for multi-word skills
        pattern = r'\b' + re.escape(keyword) + r'\b'
        if re.search(pattern, cv_lower):
            found_skills.append(keyword)
    return list(set(found_skills))


def match_jobs(cv_skills: List[str], category: str) -> List[JobMatch]:
    """
    Match extracted CV skills against job dataset.
    Returns top 3 matches with percentage scores.
    """
    jobs = load_job_dataset()
    cv_skills_lower = set(s.lower() for s in cv_skills)
    scored_jobs = []

    for job in jobs:
        job_skills = set(s.lower() for s in job.get("skills", []))
        job_requirements = job.get("requirements", [])
        
        # Also extract skill-like words from requirements
        req_text = " ".join(job_requirements).lower()
        for kw in SKILL_KEYWORDS.get(category, []):
            if kw in req_text:
                job_skills.add(kw)

        if not job_skills:
            continue

        matched = cv_skills_lower.intersection(job_skills)
        missing = job_skills - cv_skills_lower
        
        # Calculate match percentage
        if len(job_skills) > 0:
            match_pct = int((len(matched) / len(job_skills)) * 100)
        else:
            match_pct = 0

        scored_jobs.append({
            "job": job,
            "match_pct": match_pct,
            "matched": list(matched),
            "missing": list(missing)
        })

    # Sort by match percentage, take top 3
    scored_jobs.sort(key=lambda x: x["match_pct"], reverse=True)
    top_3 = scored_jobs[:3]

    results = []
    for item in top_3:
        job = item["job"]
        results.append(JobMatch(
            job_id=str(job["id"]),
            title=job.get("title_normalized_en") or job.get("title_original") or "Unknown",
            company=job.get("company") or "Unknown",
            location=job.get("location") or "Bakı",
            match_percentage=item["match_pct"],
            matched_skills=item["matched"],
            missing_skills=item["missing"],
            url=job.get("url")
        ))

    return results


def analyze_cv(file_path: str, filename: str, category: str) -> CVAnalysisResult:
    """
    Full CV analysis pipeline:
    1. Extract text from PDF
    2. Extract skills
    3. Match against job dataset
    4. Calculate overall score
    """
    cv_text = extract_text_from_pdf(file_path)
    skills = extract_skills_from_cv(cv_text, category)
    matches = match_jobs(skills, category)
    
    # Overall score = average of top matches, with a floor
    if matches:
        overall = int(sum(m.match_percentage for m in matches) / len(matches))
    else:
        overall = 0
    
    # Ensure a minimum meaningful score if skills are found
    if skills and overall < 15:
        overall = 15

    category_labels = {
        "cybersecurity": "Cybersecurity",
        "ml": "Machine Learning",
        "fullstack": "Full Stack Development",
        "data_analysis": "Data Analysis"
    }

    summary = (
        f"Extracted {len(skills)} relevant skills from your CV for "
        f"{category_labels.get(category, category)}. "
        f"Found {len(matches)} potential job matches in the Azerbaijan market."
    )

    return CVAnalysisResult(
        filename=filename,
        extracted_skills=skills,
        target_category=category,
        overall_score=overall,
        top_matches=matches,
        summary=summary
    )


async def get_ai_recommendations(cv_skills: List[str], category: str, job_matches: List[JobMatch]) -> AIRecommendationResult:
    """
    Call Groq/Llama 3.3 70B to generate personalized skill gap analysis
    and improvement recommendations.
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        # Fallback if no API key
        return _fallback_recommendations(cv_skills, category, job_matches)

    try:
        client = Groq(api_key=api_key)
        
        # Build the prompt
        missing_all = set()
        for match in job_matches:
            missing_all.update(match.missing_skills)
        
        category_labels = {
            "cybersecurity": "Cybersecurity",
            "ml": "Machine Learning",
            "fullstack": "Full Stack Development",
            "data_analysis": "Data Analysis"
        }
        
        prompt = f"""You are a career advisor specializing in {category_labels.get(category, category)} jobs in Azerbaijan.

A candidate has the following skills: {', '.join(cv_skills) if cv_skills else 'No specific skills detected'}

They are missing these skills that are required by top job postings: {', '.join(missing_all) if missing_all else 'None identified'}

Their top job matches had these match percentages: {', '.join(f'{m.title} at {m.company} ({m.match_percentage}%)' for m in job_matches)}

Please provide:
1. A list of the top 5 most critical skills they need to learn, with importance level (critical/recommended/nice-to-have), a brief reason why, and 1-2 specific free/affordable learning resources for each.
2. A personalized improvement plan (3-4 sentences) explaining what to focus on first and why.
3. An estimated time to become competitive (e.g., "3-6 months of focused study").

Format your response as JSON with this exact structure:
{{
  "skill_gaps": [
    {{"skill": "...", "importance": "critical", "reason": "...", "resources": ["...", "..."]}}
  ],
  "improvement_plan": "...",
  "estimated_time": "..."
}}

Return ONLY valid JSON, no markdown formatting or extra text."""

        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=1500,
        )
        
        response_text = chat_completion.choices[0].message.content.strip()
        
        # Try to parse JSON from response
        # Sometimes the model wraps in markdown code blocks
        if response_text.startswith("```"):
            lines = response_text.split("\n")
            response_text = "\n".join(lines[1:-1])
        
        data = json.loads(response_text)
        
        skill_gaps = []
        for sg in data.get("skill_gaps", [])[:5]:
            skill_gaps.append(SkillRecommendation(
                skill=sg.get("skill", "Unknown"),
                importance=sg.get("importance", "recommended"),
                reason=sg.get("reason", ""),
                resources=sg.get("resources", [])
            ))
        
        return AIRecommendationResult(
            skill_gaps=skill_gaps,
            improvement_plan=data.get("improvement_plan", "Focus on acquiring the critical skills identified above."),
            estimated_time=data.get("estimated_time", "3-6 months")
        )
    except Exception as e:
        print(f"Groq API error: {e}")
        return _fallback_recommendations(cv_skills, category, job_matches)

def deep_analyze_job_matches(cv_text: str, top_matches: List[JobMatch]) -> List[JobMatch]:
    """
    Deep refine semantic_score, skill_match, and overall_fit for the top matches
    by querying Llama 3.3.
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key or not top_matches:
        return top_matches

    try:
        client = Groq(api_key=api_key)
        
        # We only really want to parse one prompt for all top matches to save limits and time
        jobs_json = []
        for i, match in enumerate(top_matches):
            jobs_json.append({
                "job_index": i,
                "title": match.title,
                "required_skills_base": match.required_skills,
                "current_overall_score": match.match_percentage
            })
            
        prompt = f"""You are an expert HR AI System. Your job is to deeply analyze the candidate's CV against {len(top_matches)} specific job descriptions and assign precise match scores.
        
Candidate CV Summary or Text: 
{cv_text[:3000]} # Trimmed for context length just in case

Job Postings:
{json.dumps(jobs_json, indent=2)}

Calculate for EACH job:
1. semantic_score (0-100): How conceptually aligned the candidate's experience is with the role.
2. skill_match (0-100): How well they truly fulfill the required skills contextually.
3. overall_fit (0-100): Your final, highly reasoned assessment.

Return ONLY pure valid JSON with this exact structure for all jobs:
{{
  "evaluations": [
    {{
      "job_index": 0,
      "semantic_score": 85.5,
      "skill_match": 80.0,
      "overall_fit": 84.0
    }}
  ]
}}
"""
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            max_tokens=1000,
            response_format={"type": "json_object"}
        )
        response_text = chat_completion.choices[0].message.content.strip()
        data = json.loads(response_text)
        
        evaluations = data.get("evaluations", [])
        for ev in evaluations:
            idx = ev.get("job_index")
            if 0 <= idx < len(top_matches):
                match = top_matches[idx]
                match.scores = ScoreBreakdown(
                    semantic=float(ev.get("semantic_score", match.scores.semantic if match.scores else 0)),
                    skill_match=float(ev.get("skill_match", match.scores.skill_match if match.scores else 0)),
                    final=float(ev.get("overall_fit", match.match_percentage))
                )
                match.match_percentage = match.scores.final
        
        # Resort based on new deep LLM overall_fit
        top_matches.sort(key=lambda x: x.match_percentage, reverse=True)
        return top_matches
        
    except Exception as e:
        print(f"Deep Analyze Error: {e}")
        return top_matches


def _fallback_recommendations(cv_skills: List[str], category: str, job_matches: List[JobMatch]) -> AIRecommendationResult:
    """Fallback recommendations when API is unavailable."""
    missing_all = set()
    for match in job_matches:
        missing_all.update(match.missing_skills)
    
    skill_gaps = []
    for i, skill in enumerate(list(missing_all)[:5]):
        importance = "critical" if i < 2 else ("recommended" if i < 4 else "nice-to-have")
        skill_gaps.append(SkillRecommendation(
            skill=skill,
            importance=importance,
            reason=f"Required by top job postings in your target category.",
            resources=[f"Search for '{skill} tutorial' on YouTube", f"Coursera/Udemy courses on {skill}"]
        ))
    
    return AIRecommendationResult(
        skill_gaps=skill_gaps,
        improvement_plan="Start by focusing on the critical skills listed above, as they appear most frequently in job requirements. Build hands-on projects to demonstrate practical application.",
        estimated_time="3-6 months of focused study"
    )
