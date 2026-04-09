from fastapi import APIRouter, HTTPException
from typing import List
from models import StudentProfile, ReadinessScore, Recommendation, MarketInsight, CohortInsight
import mock_data

router = APIRouter()

@router.post("/student/analyze", response_model=ReadinessScore)
def analyze_student(profile: StudentProfile):
    # Mocking the AI matching logic
    if profile.target_role == "Junior Data Analyst":
        missing = ["SQL", "Power BI", "Statistics"]
        score = 72
        recs = [
            Recommendation(type="course", title="Advanced SQL for Analytics", description="Learn complex joins and window functions."),
            Recommendation(type="certification", title="Power BI Data Analyst", description="Official certification.")
        ]
        explain = f"You are {score}% ready for {profile.target_role}. Your Python skills are great, but the market demands SQL and Power BI for this role."
    elif profile.target_role == "Frontend Developer":
        missing = ["React", "TypeScript"]
        score = 80
        recs = [
            Recommendation(type="course", title="Learn React", description="Component-based architecture."),
        ]
        explain = f"You are {score}% ready for {profile.target_role}. Adding React to your core web skills is the most direct path to employability."
    else:
        missing = ["Unknown Role Gap"]
        score = 50
        recs = [Recommendation(type="project", title="General Project", description="Build something!")]
        explain = "We don't have enough specific data for this role yet."

    return ReadinessScore(
        student_id=profile.id,
        role=profile.target_role,
        score=score,
        missing_skills=missing,
        recommendations=recs,
        explanation=explain
    )

@router.get("/market/insights", response_model=MarketInsight)
def get_market_insights():
    return mock_data.mock_market_insight

@router.get("/admin/cohort-gap", response_model=CohortInsight)
def get_cohort_gap():
    return mock_data.mock_cohort_insight

@router.post("/explain/recommendation")
def explain_recommendation(score: ReadinessScore):
    # In reality this would call an LLM (OpenAI/Anthropic) using the ReadinessScore as context
    # We mock it here for the 60s demo requirement constraint.
    return {
        "explanation": f"Based on our analysis of the Azerbaijan market, {score.role} positions highly value {', '.join(score.missing_skills)}. Given your current score of {score.score}%, acquiring these skills will make your profile extremely competitive."
    }
