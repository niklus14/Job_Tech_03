import json
import os
import httpx
from fastapi import APIRouter, UploadFile, File, HTTPException, Body
from typing import List, Optional
from pydantic import BaseModel
from models import (
    CourseStudent, IntegratedStudentProfile, CourseDashboardStats,
    JobMatch, ScoreBreakdown
)
from ml_analyzer import extract_skills, load_job_dataset, predict_required_skills, \
    get_missing_skills, get_course_recommendations, course_impact_analysis

router = APIRouter(prefix="/course", tags=["Course & Companies"])

# In-memory student storage
_course_students: List[CourseStudent] = []

# Pre-loaded Holberton demo students
_demo_students = [
    CourseStudent(
        student_id="hbn_001",
        name="Aysel Mammadova",
        email="aysel@holberton.az",
        course_name="Holberton - Cybersecurity Foundations",
        progress_percentage=78.5,
        completed_modules=["Network Basics", "Linux Administration", "Python Scripting", "Intro to Security"],
        skills_acquired=["Python", "Linux", "network security"]
    ),
    CourseStudent(
        student_id="hbn_002",
        name="Tural Aliyev",
        email="tural@holberton.az",
        course_name="Holberton - Full Stack Web Dev",
        progress_percentage=92.0,
        completed_modules=["HTML/CSS", "JavaScript", "React", "Node.js", "Databases", "DevOps"],
        skills_acquired=["JavaScript", "Python", "Linux"]
    ),
    CourseStudent(
        student_id="hbn_003",
        name="Nigar Hasanova",
        email="nigar@holberton.az",
        course_name="Holberton - Data Science Track",
        progress_percentage=65.0,
        completed_modules=["Python for Data", "Statistics", "SQL Fundamentals"],
        skills_acquired=["Python", "Linux"]
    ),
    CourseStudent(
        student_id="hbn_004",
        name="Rashad Guliyev",
        email="rashad@holberton.az",
        course_name="Holberton - Cybersecurity Foundations",
        progress_percentage=45.0,
        completed_modules=["Network Basics", "Linux Administration"],
        skills_acquired=["Linux", "network security"]
    ),
    CourseStudent(
        student_id="hbn_005",
        name="Leyla Abdullayeva",
        email="leyla@holberton.az",
        course_name="Holberton - ML Engineering",
        progress_percentage=88.0,
        completed_modules=["Python Advanced", "Math Foundations", "ML Algorithms", "Deep Learning", "NLP Basics"],
        skills_acquired=["Python", "Linux"]
    )
]

_course_students.extend(_demo_students)


# ─── Holberton API Adapter ───

# Map Holberton project names -> job market skills
PROJECT_SKILL_MAP = {
    "python": "Python",
    "shell": "Linux",
    "c programming": "C",
    "c -": "C",
    "sql": "databases",
    "nosql": "databases",
    "networking": "networking",
    "docker": "cloud infrastructure",
    "restful api": "Python",
    "web infrastructure": "cloud infrastructure",
    "javascript": "JavaScript",
    "react": "JavaScript",
    "node": "JavaScript",
    "html": "JavaScript",
    "css": "JavaScript",
    "cybersecurity": "cybersecurity",
    "security": "cybersecurity",
    "nmap": "vulnerability scanning",
    "wireshark": "SIEM",
    "firewall": "firewall",
    "ids": "IDS/IPS",
    "penetration": "penetration testing",
    "pentest": "penetration testing",
    "incident": "incident response",
    "soc": "SOC",
    "siem": "SIEM",
    "threat": "threat intelligence",
    "malware": "endpoint security",
    "forensic": "incident response",
    "encryption": "cybersecurity",
    "owasp": "OWASP",
    "vulnerability": "vulnerability assessment",
    "reverse engineering": "cybersecurity",
    "machine learning": "Python",
    "deep learning": "Python",
    "data": "databases",
    "linux": "Linux",
}


def _map_holberton_projects_to_skills(projects: list) -> list:
    """Map Holberton project names to job market skills."""
    skills = set()
    for project in projects:
        name_lower = project.get("name", "").lower()
        for keyword, skill in PROJECT_SKILL_MAP.items():
            if keyword in name_lower:
                skills.add(skill)
    return list(skills)


def _parse_holberton_student(data: dict) -> CourseStudent:
    """Parse Holberton API response into our CourseStudent model."""
    # Get name
    first = data.get("first_name", "")
    last = data.get("last_name", "")
    name = f"{first} {last}".strip() or "Unknown Student"

    # Get email
    email = data.get("email", "")

    # Get student ID
    student_id = str(data.get("id", ""))

    # Get cohort
    cohort = data.get("cohort", {})
    cohort_name = cohort.get("name", "Holberton")

    # Get projects from curricula
    all_projects = []
    curricula = data.get("curricula", [])
    for curriculum in curricula:
        projects = curriculum.get("projects", [])
        all_projects.extend(projects)

    # Calculate progress as avg score of all projects
    if all_projects:
        total_score = sum(p.get("score", 0) or 0 for p in all_projects)
        progress = round(total_score / len(all_projects), 1)
    else:
        progress = 0.0

    # Map projects to skills
    skills = _map_holberton_projects_to_skills(all_projects)

    # Get completed module names
    completed = [p.get("name", "") for p in all_projects if (p.get("score", 0) or 0) >= 70]

    return CourseStudent(
        student_id=f"hbtn_{student_id}",
        name=name,
        email=email,
        course_name=cohort_name,
        progress_percentage=progress,
        completed_modules=completed,
        skills_acquired=skills
    )


class APISyncRequest(BaseModel):
    api_url: str  # e.g. https://intranet.hbtn.io/api/v1/students/12580
    api_key: str
    student_ids: Optional[List[str]] = None  # optional specific IDs


@router.post("/sync-api")
async def sync_from_api(req: APISyncRequest):
    """
    Sync student data from an external LMS API (e.g. Holberton).
    Provide the API URL (base or with student ID) and the API key.
    """
    global _course_students

    headers = {
        "accept": "application/json",
        "X-API-KEY": req.api_key
    }

    synced = []
    errors = []

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            # If URL ends with a student ID, fetch just that one
            # Otherwise try to fetch the list or provided IDs
            if req.student_ids and len(req.student_ids) > 0:
                for sid in req.student_ids:
                    url = req.api_url.rstrip("/")
                    if not url.endswith(sid):
                        url = f"{url}/{sid}"
                    try:
                        resp = await client.get(url, headers=headers)
                        if resp.status_code == 200:
                            data = resp.json()
                            student = _parse_holberton_student(data)
                            synced.append(student)
                        else:
                            errors.append(f"Student {sid}: HTTP {resp.status_code}")
                    except Exception as e:
                        errors.append(f"Student {sid}: {str(e)}")
            else:
                # Try fetching the single URL provided
                resp = await client.get(req.api_url, headers=headers)
                if resp.status_code == 200:
                    data = resp.json()
                    # Check if response is a list or single student
                    if isinstance(data, list):
                        for item in data:
                            student = _parse_holberton_student(item)
                            synced.append(student)
                    elif isinstance(data, dict):
                        student = _parse_holberton_student(data)
                        synced.append(student)
                else:
                    raise HTTPException(
                        status_code=resp.status_code,
                        detail=f"API returned HTTP {resp.status_code}: {resp.text[:200]}"
                    )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error connecting to API: {str(e)}")

    if synced:
        # Remove any existing students with same IDs, then add new ones
        synced_ids = {s.student_id for s in synced}
        _course_students = [s for s in _course_students if s.student_id not in synced_ids]
        _course_students.extend(synced)

    return {
        "message": f"Successfully synced {len(synced)} students",
        "synced_count": len(synced),
        "errors": errors,
        "total_students": len(_course_students)
    }


# ─── Job Readiness Calculator (Fast — skill-match only, no SBERT) ───

def _calculate_job_readiness(student: CourseStudent) -> tuple:
    """Calculate job readiness using skill-match only (fast, no SBERT).
    SBERT is too slow for batch student processing on CPU.
    Individual CV analysis still uses the full SBERT pipeline.
    """
    skills = student.skills_acquired
    dataset = load_job_dataset()

    matches = []
    all_missing = set()

    for item in dataset:
        desc = item.get("description", "")
        required = item.get("_cached_required_skills")
        if required is None:
            required = predict_required_skills(desc)
        
        # Fast: skill-match only (no SBERT encoding)
        missing = get_missing_skills(skills, required)
        matched = [s for s in required if s in skills]
        
        if required:
            skill_match = round((len(matched) / len(required)) * 100, 2)
        else:
            skill_match = 0.0
        
        # Use skill_match as the score directly (no semantic component)
        final_score = skill_match

        job_id = str(item.get("id", ""))
        title = item.get("title_normalized_en") or item.get("title_original") or "Unknown"
        company = item.get("company") or "Unknown"
        location = item.get("location") or "Bakı"
        url = item.get("url")

        matches.append(JobMatch(
            job_id=job_id,
            title=title,
            company=company,
            location=location,
            match_percentage=final_score,
            scores=ScoreBreakdown(final=final_score, skill_match=skill_match, semantic=0.0),
            matched_skills=matched,
            missing_skills=missing,
            url=url
        ))
        all_missing.update(missing)

    matches.sort(key=lambda x: x.match_percentage, reverse=True)
    top_matches = matches[:3]

    if top_matches:
        job_readiness = int(sum(m.match_percentage for m in top_matches) / len(top_matches))
    else:
        job_readiness = 0

    combined = round(student.progress_percentage * 0.4 + job_readiness * 0.6, 1)

    return job_readiness, combined, top_matches, list(all_missing)[:10]


@router.get("/students", response_model=List[IntegratedStudentProfile])
def get_all_students():
    """Get all course students with their integrated profiles."""
    results = []
    for student in _course_students:
        job_readiness, combined, matches, gaps = _calculate_job_readiness(student)
        results.append(IntegratedStudentProfile(
            student=student,
            job_readiness_score=job_readiness,
            combined_score=combined,
            top_job_matches=matches[:3],
            skill_gaps=gaps
        ))
    return results


@router.post("/upload-students")
async def upload_student_data(file: UploadFile = File(...)):
    """Upload a JSON file containing student data from a course platform."""
    if not file.filename.lower().endswith(".json"):
        raise HTTPException(status_code=400, detail="Only JSON files are supported")

    try:
        content = await file.read()
        data = json.loads(content)

        new_students = []
        if isinstance(data, list):
            for item in data:
                student = CourseStudent(**item)
                new_students.append(student)
        else:
            raise HTTPException(status_code=400, detail="JSON must contain a list of student objects")

        _course_students.extend(new_students)

        return {
            "message": f"Successfully uploaded {len(new_students)} students",
            "total_students": len(_course_students)
        }
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing student data: {str(e)}")


@router.get("/integrate/{student_id}", response_model=IntegratedStudentProfile)
def integrate_student(student_id: str):
    """Get the integrated profile for a specific student."""
    student = None
    for s in _course_students:
        if s.student_id == student_id:
            student = s
            break

    if not student:
        raise HTTPException(status_code=404, detail=f"Student '{student_id}' not found")

    job_readiness, combined, matches, gaps = _calculate_job_readiness(student)

    return IntegratedStudentProfile(
        student=student,
        job_readiness_score=job_readiness,
        combined_score=combined,
        top_job_matches=matches[:3],
        skill_gaps=gaps
    )


@router.get("/dashboard", response_model=CourseDashboardStats)
def get_dashboard_stats():
    """Get aggregate dashboard statistics for all course students."""
    if not _course_students:
        return CourseDashboardStats(
            total_students=0,
            avg_progress=0,
            avg_job_readiness=0,
            avg_combined_score=0,
            top_missing_skills=[]
        )

    total = len(_course_students)
    avg_progress = sum(s.progress_percentage for s in _course_students) / total

    all_readiness = []
    all_combined = []
    all_missing = {}

    for student in _course_students:
        job_readiness, combined, _, gaps = _calculate_job_readiness(student)
        all_readiness.append(job_readiness)
        all_combined.append(combined)
        for gap in gaps:
            all_missing[gap] = all_missing.get(gap, 0) + 1

    avg_readiness = sum(all_readiness) / total
    avg_combined = sum(all_combined) / total

    top_missing = sorted(all_missing.items(), key=lambda x: x[1], reverse=True)[:10]
    top_missing_list = [{"skill": skill, "count": count} for skill, count in top_missing]

    return CourseDashboardStats(
        total_students=total,
        avg_progress=round(avg_progress, 1),
        avg_job_readiness=round(avg_readiness, 1),
        avg_combined_score=round(avg_combined, 1),
        top_missing_skills=top_missing_list
    )
