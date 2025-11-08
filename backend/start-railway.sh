#!/bin/bash
# Railway startup script for lite mode (no TensorFlow)
export SKIP_TENSORFLOW=1
uvicorn main:app --host 0.0.0.0 --port $PORT
