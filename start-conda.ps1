# BrainHealth AI - Start Application (Conda Version)
# This script starts both frontend and backend with Anaconda

Write-Host "Starting BrainHealth AI (Conda)..." -ForegroundColor Cyan
Write-Host ""

$PROJECT_ROOT = "c:\Users\aashi\OneDrive\Desktop\BrainHealth AI"

# Start Backend with conda environment
Write-Host "Starting Backend Server with Conda..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& 'C:\Users\aashi\anaconda3\Scripts\conda.exe' run -n brainhealth --no-capture-output --live-stream python '$PROJECT_ROOT\backend\main.py'"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PROJECT_ROOT\frontend'; npm run dev"

# Wait a bit for frontend to start
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "Servers starting..." -ForegroundColor Green
Write-Host ""
Write-Host "Opening browser in 5 seconds..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

# Open browser
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "BrainHealth AI is running!" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Backend: http://localhost:8000" -ForegroundColor White
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C in each terminal to stop servers" -ForegroundColor Gray
