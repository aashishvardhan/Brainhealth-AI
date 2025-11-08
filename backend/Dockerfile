FROM python:3.10-slim

WORKDIR /app

# Install system dependencies efficiently
RUN apt-get update && apt-get install -y \
    build-essential \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copy requirements
COPY requirements.txt .

# Install Python dependencies with optimizations for Railway
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code and models
COPY . .

# Expose port (Railway uses PORT env variable)
ENV PORT=8000
EXPOSE 8000

# Start server
CMD uvicorn main:app --host 0.0.0.0 --port $PORT
