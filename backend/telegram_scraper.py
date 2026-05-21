import html
import json
import os
import re
import urllib.request
from urllib.error import URLError, HTTPError

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
POSTS_FILE = os.path.join(BASE_DIR, "telegram_posts.json")
STATE_FILE = os.path.join(BASE_DIR, "telegram_state.json")
CHANNEL = "crjaz"
PAGE_SIZE = 20
POSTS_LIMIT = int(os.getenv("TELEGRAM_POSTS_LIMIT", "500"))
USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"


def load_json(path, default):
    if not os.path.exists(path):
        return default
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def fetch_page(before=None):
    url = f"https://t.me/s/{CHANNEL}"
    if before is not None:
        url = f"{url}?before={before}"
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8", errors="replace")


def clean_html_text(raw_html):
    text = raw_html.replace("<br/>", "\n").replace("<br />", "\n").replace("<br>", "\n")
    text = re.sub(r"<.*?>", "", text, flags=re.DOTALL)
    return html.unescape(text).strip()


def parse_messages(html_text):
    pattern = re.compile(
        r'<div class="tgme_widget_message[^>]+data-post="[^/]+/(?P<id>\d+)"[^>]*>.*?'
        r'<div class="tgme_widget_message_text js-message_text"[^>]*>(?P<text>.*?)</div>.*?'
        r'<time datetime="(?P<date>[^"]+)"',
        re.DOTALL,
    )
    messages = []
    for match in pattern.finditer(html_text):
        message_id = int(match.group("id"))
        text = clean_html_text(match.group("text"))
        date = match.group("date")
        messages.append({
            "id": message_id,
            "date": date,
            "text": text,
        })
    return messages


def parse_next_before(html_text):
    match = re.search(r'data-before="(\d+)"', html_text)
    if match:
        return int(match.group(1))
    return None


def collect_last_messages(limit=POSTS_LIMIT):
    collected = []
    before = None

    while len(collected) < limit:
        html_text = fetch_page(before=before)
        page_messages = parse_messages(html_text)
        if not page_messages:
            break

        if before is None:
            collected.extend(page_messages)
        else:
            collected.extend(page_messages)

        if len(page_messages) < PAGE_SIZE:
            break

        before = parse_next_before(html_text)
        if before is None or before == page_messages[-1]["id"]:
            break

    sorted_messages = sorted(collected, key=lambda item: item["id"])
    return sorted_messages[:limit]


def main():
    posts = load_json(POSTS_FILE, [])
    existing_ids = {(item["channel"], item["id"]) for item in posts if "channel" in item and "id" in item}
    new_posts = []

    scraped = collect_last_messages(limit=POSTS_LIMIT)
    for message in scraped:
        unique_ref = (CHANNEL, message["id"])
        if unique_ref in existing_ids:
            continue
        new_posts.append({
            "channel": CHANNEL,
            "id": message["id"],
            "date": message["date"],
            "text": message["text"],
            "author": None,
            "url": f"https://t.me/{CHANNEL}/{message['id']}",
        })
        existing_ids.add(unique_ref)

    if new_posts:
        posts.extend(new_posts)
        posts.sort(key=lambda item: item.get("date") or item.get("id", 0))
        if len(posts) > POSTS_LIMIT:
            posts = posts[-POSTS_LIMIT:]
        save_json(POSTS_FILE, posts)
        state = load_json(STATE_FILE, {})
        state[CHANNEL] = max(item["id"] for item in posts if item.get("channel") == CHANNEL)
        save_json(STATE_FILE, state)
        print(f"Saved {len(new_posts)} new posts to {POSTS_FILE}.")
    else:
        print("No new posts to save.")


if __name__ == "__main__":
    try:
        main()
    except HTTPError as exc:
        print("HTTP error while fetching messages:", exc)
    except URLError as exc:
        print("URL error while fetching messages:", exc)
    except Exception as exc:
        print("Unexpected error:", exc)
