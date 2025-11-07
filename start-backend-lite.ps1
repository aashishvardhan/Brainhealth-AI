# Quick Start Backend (Without TensorFlow/Heavy Dependencies)
# Use this if you have dependency conflicts

Write-Host "Starting BrainHealth AI Backend (Lite Mode)" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This version runs without TensorFlow for testing" -ForegroundColor Yellow
Write-Host "PDF and basic features will work" -ForegroundColor Yellow
Write-Host ""

cd "c:\Users\aashi\OneDrive\Desktop\BrainHealth AI\backend"

# Set environment variable to skip TensorFlow
$env:SKIP_TENSORFLOW = "1"

python main.py
