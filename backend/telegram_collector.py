import argparse
import asyncio
import json
import logging
import os

from dotenv import load_dotenv
from telethon import TelegramClient
from telethon.errors import SessionPasswordNeededError

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(BASE_DIR, "telegram_channels.json")
STATE_FILE = os.path.join(BASE_DIR, "telegram_state.json")
POSTS_FILE = os.path.join(BASE_DIR, "telegram_posts.json")
SESSION_FILE = os.path.join(BASE_DIR, "telegram_collector.session")
POSTS_LIMIT = int(os.getenv("TELEGRAM_POSTS_LIMIT", "500"))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

load_dotenv(os.path.join(BASE_DIR, ".env"))


def load_json(path, default):
    if not os.path.exists(path):
        return default
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as exc:
        logging.warning("Failed to read %s: %s", path, exc)
        return default


def save_json(path, data):
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as exc:
        logging.error("Failed to write %s: %s", path, exc)


def normalize_channel_identifier(channel):
    if not channel:
        return channel
    channel = channel.strip()
    if channel.startswith("https://"):
        channel = channel.split("/")[-1]
    if channel.startswith("http://"):
        channel = channel.split("/")[-1]
    if channel.startswith("t.me/"):
        channel = channel.split("/")[-1]
    if channel.startswith("@"):
        channel = channel[1:]
    return channel


def get_channels(override_channels=None):
    channels = []
    env_value = os.getenv("TELEGRAM_CHANNELS", "")
    if override_channels:
        channels = override_channels
    elif env_value:
        channels = [item.strip() for item in env_value.split(",") if item.strip()]
    else:
        config = load_json(CONFIG_FILE, [])
        if isinstance(config, list):
            channels = config
        elif isinstance(config, dict) and "channels" in config:
            channels = config["channels"]
    normalized = [normalize_channel_identifier(ch) for ch in channels if ch]
    return sorted(set(normalized))


def build_post_url(channel, message_id):
    return f"https://t.me/{channel}/{message_id}"


def format_message_data(channel, message):
    return {
        "channel": channel,
        "id": message.id,
        "date": message.date.isoformat() if message.date else None,
        "text": message.message or "",
        "author": str(message.sender_id) if message.sender_id else None,
        "url": build_post_url(channel, message.id),
    }


async def collect_channel_messages(client, channel, last_id, backfill_limit=0):
    entity = await client.get_entity(channel)
    new_messages = []

    if backfill_limit and last_id == 0:
        async for message in client.iter_messages(entity, limit=backfill_limit):
            if message.id is None:
                continue
            new_messages.append(message)
        new_messages = list(reversed(new_messages))
        return new_messages

    async for message in client.iter_messages(entity, min_id=last_id, reverse=True):
        if message.id is None:
            continue
        if last_id and message.id <= last_id:
            continue
        new_messages.append(message)
    return new_messages


async def collect_once(channels, backfill_limit=0):
    api_id = os.getenv("TELEGRAM_API_ID")
    api_hash = os.getenv("TELEGRAM_API_HASH")
    if not api_id or not api_hash:
        raise RuntimeError("TELEGRAM_API_ID and TELEGRAM_API_HASH must be set in the environment or .env file.")

    state = load_json(STATE_FILE, {})
    posts = load_json(POSTS_FILE, [])
    posts.sort(key=lambda item: item.get("date") or item.get("id", 0))
    if len(posts) > POSTS_LIMIT:
        posts = posts[-POSTS_LIMIT:]

    existing_ids = {(item["channel"], item["id"]) for item in posts if "channel" in item and "id" in item}

    new_post_count = 0
    updated_state = dict(state)

    async with TelegramClient(SESSION_FILE, int(api_id), api_hash) as client:
        try:
            await client.start()
        except SessionPasswordNeededError:
            logging.error("A two-step verification password is required for the Telegram session.")
            return 0

        for channel in channels:
            if not channel:
                continue
            channel_key = normalize_channel_identifier(channel)
            last_id = updated_state.get(channel_key, 0)
            logging.info("Collecting new posts for channel %s since message_id=%s", channel_key, last_id)

            try:
                messages = await collect_channel_messages(client, channel_key, last_id, backfill_limit=backfill_limit)
            except Exception as exc:
                logging.error("Failed to collect from %s: %s", channel_key, exc)
                continue

            if not messages:
                logging.info("No new posts found for %s", channel_key)
                continue

            for message in messages:
                payload = format_message_data(channel_key, message)
                unique_ref = (payload["channel"], payload["id"])
                if unique_ref in existing_ids:
                    logging.debug("Skipping duplicate post %s on %s", payload["id"], payload["channel"])
                    continue
                posts.append(payload)
                existing_ids.add(unique_ref)
                new_post_count += 1

            highest_id = max(message.id for message in messages)
            updated_state[channel_key] = max(last_id, highest_id)
            logging.info("Collected %d new posts from %s", len(messages), channel_key)

    if len(posts) > POSTS_LIMIT:
        posts.sort(key=lambda item: item.get("date") or item.get("id", 0))
        posts = posts[-POSTS_LIMIT:]

    if new_post_count:
        save_json(POSTS_FILE, posts)
        save_json(STATE_FILE, updated_state)
        logging.info("Saved %d new posts and updated state.", new_post_count)
    else:
        logging.info("No new posts to save.")

    return new_post_count


def run_scheduler(channels, interval_seconds=600, backfill_limit=0):
    async def loop():
        while True:
            try:
                count = await collect_once(channels, backfill_limit=backfill_limit)
                logging.info("Cycle complete. New posts: %d", count)
            except Exception as exc:
                logging.exception("Collector cycle failed: %s", exc)
            logging.info("Sleeping for %d seconds before next collection.", interval_seconds)
            await asyncio.sleep(interval_seconds)

    asyncio.run(loop())


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Telegram channel collector using Telethon.")
    parser.add_argument("--once", action="store_true", help="Run a single collection cycle and exit.")
    parser.add_argument("--interval", type=int, default=600, help="Seconds between automatic collection cycles.")
    parser.add_argument(
        "--backfill",
        type=int,
        default=0,
        help="If no saved state exists, fetch the last N messages from each channel instead of all available history.",
    )
    parser.add_argument(
        "--channels",
        help="Comma-separated list of Telegram channels to collect from. Overrides telegram_channels.json and TELEGRAM_CHANNELS.",
    )
    args = parser.parse_args()

    channels = None
    if args.channels:
        channels = [normalize_channel_identifier(c) for c in args.channels.split(",") if c.strip()]

    active_channels = get_channels(channels)
    if not active_channels:
        raise SystemExit("No Telegram channels configured. Add channels to telegram_channels.json or set TELEGRAM_CHANNELS.")

    logging.info("Starting Telegram collector for channels: %s", ", ".join(active_channels))

    if args.once:
        asyncio.run(collect_once(active_channels, backfill_limit=args.backfill))
    else:
        run_scheduler(active_channels, interval_seconds=args.interval, backfill_limit=args.backfill)
