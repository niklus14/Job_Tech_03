import json
import os
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JOB_DATASET_PATH = os.path.join(BASE_DIR, "job_dataset.json")
TELEGRAM_POSTS_PATH = os.path.join(BASE_DIR, "telegram_posts.json")
TELEGRAM_POSTS_LIMIT = int(os.getenv("TELEGRAM_POSTS_LIMIT", "500"))


# Lightweight skill keyword bank used to tag Telegram posts so analyzers
# have explicit `skills` to match against CVs. This is intentionally small
# and fast (no heavy ML) to improve matching quality from noisy posts.
SKILL_KEYWORDS = [
    "python", "java", "javascript", "typescript", "react", "angular",
    "node", "django", "flask", "fastapi", "sql", "postgres", "mysql",
    "aws", "azure", "gcp", "docker", "kubernetes", "devops", "linux",
    "network", "security", "cybersecurity", "siem", "splunk", "edr",
    "penetration testing", "vulnerability", "nlp", "machine learning",
    "data", "data analysis", "etl", "spark", "pandas", "numpy",
    "tensorflow", "pytorch", "scala", "c#", "php", "ruby", "go",
    "sql server", "pl/sql", "oracle", "android", "ios", "kotlin",
    "swift", "react native", "git", "ci/cd", "docker-compose"
]


def _extract_skills_from_text(text: str) -> list:
    if not text:
        return []
    txt = text.lower()
    found = set()
    for kw in SKILL_KEYWORDS:
        if kw in txt:
            found.add(kw)
    return sorted(found)


def load_json(path, default):
    if not os.path.exists(path):
        return default
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


def _extract_title_from_text(text: str, default_title: str) -> str:
    if not text:
        return default_title
    patterns = [r"vakansiya\s*[:\-–]\s*(.+)", r"vacancy\s*[:\-–]\s*(.+)", r"position\s*[:\-–]\s*(.+)", r"vəzifə\s*[:\-–]\s*(.+)"]
    for pattern in patterns:
        match = re.search(pattern, text, flags=re.IGNORECASE)
        if match:
            title = match.group(1).strip().split("\n")[0]
            if title:
                return title
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    if lines:
        return lines[0][:120]
    return default_title


def load_telegram_job_dataset() -> list:
    posts = load_json(TELEGRAM_POSTS_PATH, [])
    if not isinstance(posts, list) or not posts:
        return []

    posts = [p for p in posts if isinstance(p, dict) and p.get("id") is not None]
    posts.sort(key=lambda item: item.get("date") or int(item["id"]))
    if len(posts) > TELEGRAM_POSTS_LIMIT:
        posts = posts[-TELEGRAM_POSTS_LIMIT:]

    dataset = []
    for post in posts:
        post_id = post.get("id")
        text = post.get("text", "")
        title = _extract_title_from_text(text, f"Telegram Job {post_id}")
        skills = _extract_skills_from_text(text)
        dataset.append({
            "id": post_id,
            "title_original": title,
            "company": post.get("channel", "Telegram"),
            "location": "Bakı",
            "description": text,
            "skills": skills,
            "url": post.get("url"),
            "source": "telegram"
        })
    return dataset


def load_job_dataset() -> list:
    telegram_jobs = load_telegram_job_dataset()
    if telegram_jobs:
        return telegram_jobs

    dataset = load_json(JOB_DATASET_PATH, [])
    if not isinstance(dataset, list):
        return []
    return dataset
