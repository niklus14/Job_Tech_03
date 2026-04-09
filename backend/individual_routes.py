import os
import shutil
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query
from models import CVAnalysisResult, AIRecommendationResult, UserPlan
from ml_analyzer import analyze_cv_full, filter_for_free_tier
from cv_analyzer import get_ai_recommendations

router = APIRouter(prefix="/individual", tags=["Individual"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Store last analysis result in memory for recommendation calls
_last_analysis = {}

# Simple in-memory daily usage tracker (for hackathon)
_usage = {}

def _check_free_limit():
    """Track free tier usage. Returns current count."""
    from datetime import date
    today = str(date.today())
    if today not in _usage:
        _usage.clear()
        _usage[today] = 0
    _usage[today] += 1
    return _usage[today]


@router.post("/upload-cv", response_model=CVAnalysisResult)
async def upload_and_analyze_cv(
    file: UploadFile = File(...),
    tier: str = Form(default="free")
):
    """
    Upload a PDF CV and analyze it against the cybersecurity job dataset.
    tier: "free" or "pro"
    """
    if tier == "free":
        count = _check_free_limit()
        if count > 3:
            raise HTTPException(
                status_code=429,
                detail="Free tier limit reached (3 analyses per day). Upgrade to Pro for unlimited analyses."
            )

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        with open(file_path, "rb") as f:
            result = analyze_cv_full(f, file.filename)

        # Add plan info
        if tier == "free":
            count = _usage.get(str(__import__('datetime').date.today()), 0)
            result.plan = UserPlan(tier="free", analyses_today=count, analyses_limit=3)
            _last_analysis["result"] = result  # store full for recs check
            result = filter_for_free_tier(result)
        else:
            result.plan = UserPlan(tier="pro", analyses_today=0, analyses_limit=999)

        _last_analysis["result_full"] = result if tier == "pro" else None
        _last_analysis["result"] = result
        _last_analysis["tier"] = tier

        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing CV: {str(e)}")
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


@router.post("/recommend", response_model=AIRecommendationResult)
async def get_recommendations():
    """
    Get AI-powered recommendations based on the last CV analysis.
    Uses Groq/Llama 3.3 70B for personalized skill gap analysis.
    Pro tier only.
    """
    if "result" not in _last_analysis:
        raise HTTPException(
            status_code=400,
            detail="No CV analysis found. Please upload and analyze a CV first."
        )

    result = _last_analysis["result"]
    
    recommendations = await get_ai_recommendations(
        cv_skills=result.extracted_skills,
        category="cybersecurity",
        job_matches=result.top_matches
    )

    return recommendations


@router.get("/sample-cvs")
def list_sample_cvs():
    """List available sample CVs for demo purposes."""
    root_dir = os.path.join(os.path.dirname(__file__), "..")
    sample_files = []
    for fname in os.listdir(root_dir):
        if fname.lower().endswith(".pdf"):
            sample_files.append({
                "filename": fname,
                "path": os.path.join(root_dir, fname)
            })
    return {"samples": sample_files}


@router.post("/analyze-sample", response_model=CVAnalysisResult)
async def analyze_sample_cv(
    filename: str = Form(...),
    tier: str = Form(default="free")
):
    """Analyze one of the preloaded sample CVs."""
    if tier == "free":
        count = _check_free_limit()
        if count > 3:
            raise HTTPException(
                status_code=429,
                detail="Free tier limit reached (3 analyses per day). Upgrade to Pro for unlimited analyses."
            )

    root_dir = os.path.join(os.path.dirname(__file__), "..")
    file_path = os.path.join(root_dir, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"Sample CV '{filename}' not found")

    try:
        with open(file_path, "rb") as f:
            result = analyze_cv_full(f, filename)

        if tier == "free":
            count = _usage.get(str(__import__('datetime').date.today()), 0)
            result.plan = UserPlan(tier="free", analyses_today=count, analyses_limit=3)
            _last_analysis["result"] = result
            result = filter_for_free_tier(result)
        else:
            result.plan = UserPlan(tier="pro", analyses_today=0, analyses_limit=999)

        _last_analysis["result"] = result
        _last_analysis["tier"] = tier

        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing sample CV: {str(e)}")
