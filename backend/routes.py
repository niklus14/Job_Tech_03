from fastapi import APIRouter, HTTPException
from typing import List
from models import StudentProfile, ReadinessScore, Recommendation, MarketInsight, CohortInsight
from job_feed_loader import load_job_dataset
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
    dataset = load_job_dataset()
    if not dataset:
        return mock_data.mock_market_insight

    title_counts = {}
    skill_counts = {}
    salary_values = []
    for item in dataset:
        title = item.get("title_normalized_en") or item.get("title_original") or "Unknown Role"
        title_counts[title] = title_counts.get(title, 0) + 1
        for skill in item.get("skills", []):
            skill_counts[skill] = skill_counts.get(skill, 0) + 1
        salary = item.get("salary") or {}
        if isinstance(salary, dict) and salary.get("avg"):
            salary_values.append(salary["avg"])

    top_roles = [title for title, _ in sorted(title_counts.items(), key=lambda x: x[1], reverse=True)][:6]
    top_skills = [
        {"skill": skill, "demand_growth": min(90, int(count * 3))}
        for skill, count in sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)[:6]
    ]
    if salary_values:
        avg_salary = int(sum(salary_values) / len(salary_values))
        salary_range = f"₼ {avg_salary - 300} - {avg_salary + 300}" if avg_salary >= 300 else f"₼ {avg_salary}"
    else:
        salary_range = "₼ 1K - 2K"

    trend_summary = (
        f"Telegram-sourced job posts show a strong hiring pulse in data and security roles. "
        f"The top roles include {', '.join(top_roles[:3])}. "
        f"Most live openings mention skills like {', '.join([item['skill'] for item in top_skills[:3]])}. "
        f"Estimated junior salary range across visible posts is {salary_range}."
    )

    return MarketInsight(
        top_roles=top_roles,
        top_skills=top_skills,
        trend_summary=trend_summary,
        salary_range=salary_range
    )

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
