from pydantic import BaseModel
from typing import List, Optional

class Skill(BaseModel):
    name: str
    category: str

class Role(BaseModel):
    title: str
    description: str

class StudentProfile(BaseModel):
    id: str
    name: str
    current_skills: List[str]
    target_role: str
    completed_courses: List[str]

class Recommendation(BaseModel):
    type: str  # "course", "certification", "project"
    title: str
    description: str

class ReadinessScore(BaseModel):
    student_id: str
    role: str
    score: int
    missing_skills: List[str]
    recommendations: List[Recommendation]
    explanation: str

class MarketInsight(BaseModel):
    top_roles: List[str]
    top_skills: List[dict]
    trend_summary: str

class CohortInsight(BaseModel):
    cohort_id: str
    alignment_score: int
    oversupplied_skills: List[str]
    undersupplied_skills: List[str]

# ─── Individual Page Models ───

class SubscriptionTier(str):
    FREE = "free"
    PRO = "pro"

class UserPlan(BaseModel):
    tier: str
    analyses_today: int
    analyses_limit: int

class ScoreBreakdown(BaseModel):
    final: float
    skill_match: float
    semantic: float

class CourseRecommendation(BaseModel):
    skill: str
    course_name: str
    platform: str
    link: str

class LearningPathStep(BaseModel):
    skill: str
    after_learning_score: float
    increase: float

class JobMatch(BaseModel):
    job_id: str
    title: str
    company: str
    location: str
    match_percentage: float
    scores: Optional[ScoreBreakdown] = None
    matched_skills: List[str]
    missing_skills: List[str]
    cv_skills: Optional[List[str]] = None
    required_skills: Optional[List[str]] = None
    courses: Optional[List[CourseRecommendation]] = None
    learning_path: Optional[List[LearningPathStep]] = None
    url: Optional[str] = None

class CVAnalysisResult(BaseModel):
    filename: str
    target_category: str
    extracted_skills: List[str]
    overall_score: float
    top_matches: List[JobMatch]
    summary: str
    plan: Optional[UserPlan] = None

class SkillRecommendation(BaseModel):
    skill: str
    importance: str  # "critical", "recommended", "nice-to-have"
    reason: str
    resources: List[str]

class AIRecommendationResult(BaseModel):
    skill_gaps: List[SkillRecommendation]
    improvement_plan: str
    estimated_time: str

# ─── Course & Companies Models ───

class CourseStudent(BaseModel):
    student_id: str
    name: str
    email: Optional[str] = None
    course_name: str
    progress_percentage: float
    completed_modules: List[str] = []
    skills_acquired: List[str] = []

class IntegratedStudentProfile(BaseModel):
    student: CourseStudent
    job_readiness_score: Optional[int] = None
    combined_score: Optional[float] = None
    top_job_matches: List[JobMatch] = []
    skill_gaps: List[str] = []

class CourseDashboardStats(BaseModel):
    total_students: int
    avg_progress: float
    avg_job_readiness: float
    avg_combined_score: float
    top_missing_skills: List[dict]
