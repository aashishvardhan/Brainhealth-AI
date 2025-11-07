# BrainHealth AI - Quick Installation Script
# Run this in PowerShell

Write-Host "BrainHealth AI - Quick Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Get current directory
$PROJECT_ROOT = "c:\Users\aashi\OneDrive\Desktop\BrainHealth AI"

# Check Prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
Write-Host ""

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Download the LTS version and make sure to check 'Add to PATH' during installation" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "After installation, restart PowerShell and run this script again." -ForegroundColor Cyan
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm found: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found!" -ForegroundColor Red
    Write-Host "Please reinstall Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check Python
try {
    $pythonVersion = python --version
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Python from: https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host "Make sure to check 'Add Python to PATH' during installation" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "After installation, restart PowerShell and run this script again." -ForegroundColor Cyan
    exit 1
}

# Check pip
try {
    $pipVersion = pip --version
    Write-Host "✅ pip found" -ForegroundColor Green
} catch {
    Write-Host "⚠️ pip not found (will be available after venv creation)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ All prerequisites met! Starting installation..." -ForegroundColor Green
Write-Host ""

# Step 1: Frontend Dependencies
Write-Host "Step 1/4: Installing Frontend Dependencies..." -ForegroundColor Yellow
Set-Location "$PROJECT_ROOT\frontend"
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Error installing frontend dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Backend Dependencies
Write-Host "Step 2/4: Setting up Backend Environment..." -ForegroundColor Yellow
Set-Location "$PROJECT_ROOT\backend"

# Create virtual environment
Write-Host "Creating virtual environment..." -ForegroundColor Gray
python -m venv venv

# Activate virtual environment and install dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Gray
& "$PROJECT_ROOT\backend\venv\Scripts\Activate.ps1"
pip install -r requirements.txt

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend environment setup complete!" -ForegroundColor Green
} else {
    Write-Host "❌ Error installing backend dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Create Model
Write-Host "Step 3/4: Creating AI Model..." -ForegroundColor Yellow
Write-Host "This may take 1-2 minutes..." -ForegroundColor Gray
python train_model.py --dummy

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ AI model created successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Model creation had issues (you can retry later)" -ForegroundColor Yellow
}

Write-Host ""

# Step 4: Summary
Write-Host "Step 4/4: Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Installation Successful!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1️⃣  Start Backend (Terminal 1):" -ForegroundColor White
Write-Host "   cd '$PROJECT_ROOT\backend'" -ForegroundColor Gray
Write-Host "   python main.py" -ForegroundColor Gray
Write-Host ""
Write-Host "2️⃣  Start Frontend (Terminal 2):" -ForegroundColor White
Write-Host "   cd '$PROJECT_ROOT\frontend'" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3️⃣  Open Browser:" -ForegroundColor White
Write-Host "   http://localhost:3000" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   - README.md - Full documentation" -ForegroundColor Gray
Write-Host "   - SETUP.md - Setup guide" -ForegroundColor Gray
Write-Host "   - PROJECT_SUMMARY.md - Complete overview" -ForegroundColor Gray
Write-Host ""
Write-Host "Ready to deploy on Vercel + Render!" -ForegroundColor Green
Write-Host ""
Write-Host "Happy coding!" -ForegroundColor Cyan
