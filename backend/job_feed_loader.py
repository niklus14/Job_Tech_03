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


def _extract_urls_from_text(text: str) -> list:
    if not text:
        return []
    pattern = re.compile(r"https?://[^\s'\"]+", flags=re.IGNORECASE)
    return list({match.group(0).rstrip('.,;:') for match in pattern.finditer(text)})


def _extract_emails_from_text(text: str) -> list:
    if not text:
        return []
    pattern = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
    return list({match.group(0) for match in pattern.finditer(text)})


def _extract_salary_from_text(text: str) -> dict:
    if not text:
        return {}

    salary_pattern = re.compile(
        r"(?P<min>[0-9]+(?:[.,][0-9]+)?)\s*(?:[-–—to]{1,3}\s*(?P<max>[0-9]+(?:[.,][0-9]+)?))?\s*(?:₼|azn|manat|M|k|K)\b",
        flags=re.IGNORECASE
    )
    matches = salary_pattern.finditer(text)
    values = []
    for match in matches:
        min_val = match.group("min")
        max_val = match.group("max")
        if not min_val:
            continue
        def parse_num(value):
            value = value.replace(',', '.')
            if value.lower().endswith('k'):
                return float(value[:-1]) * 1000
            return float(value)
        try:
            values.append(parse_num(min_val))
            if max_val:
                values.append(parse_num(max_val))
        except ValueError:
            continue

    if not values:
        return {}

    numeric_values = [v for v in values if isinstance(v, (int, float))]
    if not numeric_values:
        return {}

    avg = round(sum(numeric_values) / len(numeric_values), 2)
    raw = ", ".join(str(int(v)) if float(v).is_integer() else str(v) for v in numeric_values)
    return {
        "raw": raw,
        "min": min(numeric_values),
        "max": max(numeric_values),
        "avg": avg,
        "currency": "AZN"
    }


def _extract_sections_from_text(text: str) -> dict:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    requirements = []
    duties = []

    section_titles = {
        "requirements": ["tələblər", "requirements", "qualification", "qualifications", "skills", "needed"],
        "duties": ["vəzifələr", "responsibilities", "duty", "tasks", "what you'll do", "what you will do"]
    }

    current = None
    for line in lines:
        lower = line.lower()
        if any(lower.startswith(title) for title in section_titles["requirements"]):
            current = "requirements"
            continue
        if any(lower.startswith(title) for title in section_titles["duties"]):
            current = "duties"
            continue
        if re.match(r"^[A-Za-zÇƏĞİÖŞÜçəğıöşü].{0,80}:$", line):
            current = None
            continue
        if current and line:
            if line.startswith(('-', '*', '•')):
                requirements.append(line.lstrip('-*• ').strip()) if current == "requirements" else duties.append(line.lstrip('-*• ').strip())
            elif current == "requirements" and line:
                requirements.append(line)
            elif current == "duties" and line:
                duties.append(line)

    return {
        "requirements": requirements,
        "duties": duties
    }


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
        urls = _extract_urls_from_text(text)
        emails = _extract_emails_from_text(text)
        salary = _extract_salary_from_text(text)
        sections = _extract_sections_from_text(text)
        telegram_url = post.get("url")
        external_links = [u for u in urls if not u.startswith("https://t.me/") and not u.startswith("http://t.me/")]
        job_url = external_links[0] if external_links else telegram_url
        dataset.append({
            "id": post_id,
            "title_original": title,
            "company": post.get("channel", "Telegram"),
            "location": "Bakı",
            "description": text,
            "skills": skills,
            "url": job_url,
            "telegram_url": telegram_url,
            "external_urls": external_links,
            "hr_emails": emails,
            "salary": salary,
            "requirements": sections.get("requirements", []),
            "duties": sections.get("duties", []),
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
