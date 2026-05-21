FROM python:3.11

ENV PYTHONUNBUFFERED=1 \
    HF_HOME=/app/.cache/huggingface \
    TRANSFORMERS_CACHE=/app/.cache/huggingface \
    SENTENCE_TRANSFORMERS_HOME=/app/.cache/sentence-transformers

WORKDIR /app/backend

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN python -m spacy download en_core_web_sm

RUN mkdir -p /app/.cache/huggingface /app/.cache/sentence-transformers /app/backend/uploads \
    && chmod -R 777 /app/.cache /app/backend/uploads

COPY backend/ .
COPY mycv.PDF /app/

EXPOSE 7860

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
