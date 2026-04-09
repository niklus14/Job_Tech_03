# Use the official Python 3.9 image
FROM python:3.9

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the Python dependencies (including FastAPI, Uvicorn, and our ML libraries)
RUN pip install --no-cache-dir -r requirements.txt

# Download the spaCy English model (required for our NLP processing)
RUN python -m spacy download en_core_web_sm

# Create a directory with full permissions so Hugging Face can create caches (SBERT needs this)
RUN mkdir -p /app/.cache/huggingface && chmod -R 777 /app/.cache

# Copy the rest of the application code into the container
COPY . .

# Expose port 7860 which is the default port Hugging Face Spaces listens on
EXPOSE 7860

# Command to run the application using Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
