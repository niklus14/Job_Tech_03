from models import StudentProfile, MarketInsight, CohortInsight

mock_students = [
    StudentProfile(
        id="stu_01", 
        name="Aysel Mammadova", 
        current_skills=["Python", "Data Analysis", "Excel"], 
        target_role="Junior Data Analyst",
        completed_courses=["Intro to Python (Holberton)"]
    ),
    StudentProfile(
        id="stu_02", 
        name="Tural Aliyev", 
        current_skills=["HTML", "CSS", "JavaScript"], 
        target_role="Frontend Developer",
        completed_courses=["Web Foundations"]
    )
]

mock_market_insight = MarketInsight(
    top_roles=["Frontend Developer", "Data Analyst", "Cybersecurity Analyst", "Machine Learning Engineer"],
    top_skills=[
        {"skill": "SQL", "demand_growth": 45},
        {"skill": "Power BI", "demand_growth": 35},
        {"skill": "React", "demand_growth": 30},
    ],
    trend_summary="Azerbaijan market shows a 45% increase in demand for data skills (SQL, Power BI) compared to last year. Frontend development continues steady growth."
)

mock_cohort_insight = CohortInsight(
    cohort_id="Holberton_C2",
    alignment_score=78,
    oversupplied_skills=["HTML", "CSS"],
    undersupplied_skills=["SQL", "Statistics", "Power BI"]
)

def get_student_by_id(student_id: str):
    for s in mock_students:
        if s.id == student_id:
            return s
    return None
