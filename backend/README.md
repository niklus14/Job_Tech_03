# Backend Telegram Collector

This backend includes a Telegram channel collector powered by `Telethon`.

## What it does

- Connects to one or more Telegram channels
- Fetches only new posts since the last run
- Stores the last processed `message_id` per channel
- Avoids duplicate inserts by checking existing message IDs
- Runs automatically every 10 minutes when started in scheduler mode


## Run the collector

- One-time collection:

```bash
cd backend
python telegram_collector.py --once
```

- Backfill the last 200 messages for a new channel and exit:

```bash
cd backend
python telegram_collector.py --once --backfill 200
```

- Automatic collection every 10 minutes:

```bash
cd backend
python telegram_collector.py
```

- Override interval (seconds):

```bash
python telegram_collector.py --interval 600
```

## Notes

- The collector keeps only the most recent 500 Telegram job posts in `backend/telegram_posts.json`.
- CV analysis and job matching now use the Telegram job feed when available, with `backend/job_dataset.json` as a fallback.
- Set `TELEGRAM_POSTS_LIMIT=500` to override the stored post cap.
