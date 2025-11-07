# Install New Features Dependencies
# Run this to add PDF and Grad-CAM capabilities

Write-Host "Installing BrainHealth AI - Advanced Features" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

$BACKEND = "c:\Users\aashi\OneDrive\Desktop\BrainHealth AI\backend"

Write-Host "Installing Python packages for:" -ForegroundColor Yellow
Write-Host "  - PDF Report Generation (ReportLab)" -ForegroundColor White
Write-Host "  - Grad-CAM Visualization (OpenCV, Matplotlib)" -ForegroundColor White
Write-Host ""

Set-Location $BACKEND

# Install packages
Write-Host "Installing reportlab..." -ForegroundColor Gray
pip install reportlab --quiet

Write-Host "Installing matplotlib..." -ForegroundColor Gray
pip install matplotlib --quiet

Write-Host "Installing opencv-python..." -ForegroundColor Gray
pip install opencv-python --quiet

Write-Host ""
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "New Features Available:" -ForegroundColor Cyan
Write-Host "  1. PDF Medical Report Generation" -ForegroundColor White
Write-Host "  2. Explainable AI (Grad-CAM) Visualization" -ForegroundColor White
Write-Host "  3. Stroke Type Classification" -ForegroundColor White
Write-Host ""
Write-Host "Start the backend:" -ForegroundColor Yellow
Write-Host "  python main.py" -ForegroundColor Gray
Write-Host ""
Write-Host "See NEW_FEATURES.md for complete documentation" -ForegroundColor Cyan
