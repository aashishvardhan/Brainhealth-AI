# BrainHealth AI - Installation Script (Anaconda/Conda Version)
# Use this if you have Anaconda installed

Write-Host "BrainHealth AI - Quick Setup (Conda)" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$PROJECT_ROOT = "c:\Users\aashi\OneDrive\Desktop\BrainHealth AI"

# Initialize conda for PowerShell
Write-Host "Initializing Conda for PowerShell..." -ForegroundColor Yellow
& "C:\Users\aashi\anaconda3\Scripts\conda.exe" init powershell
Write-Host ""
Write-Host "IMPORTANT: Please close and reopen PowerShell, then run this script again." -ForegroundColor Red
Write-Host "After restarting PowerShell, run: .\install-conda.ps1" -ForegroundColor Cyan
Write-Host ""

# Check if conda is available
try {
    $condaVersion = & conda --version
    Write-Host "Conda found: $condaVersion" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "Conda initialization required. Please:" -ForegroundColor Yellow
    Write-Host "1. Close this PowerShell window" -ForegroundColor White
    Write-Host "2. Open a NEW PowerShell window" -ForegroundColor White
    Write-Host "3. Run: .\install-conda.ps1" -ForegroundColor White
    Write-Host ""
    exit 0
}

Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Download the LTS version and check 'Add to PATH'" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "npm found: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "npm not found! Please reinstall Node.js" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Prerequisites OK! Starting installation..." -ForegroundColor Green
Write-Host ""

# Step 1: Frontend Dependencies
Write-Host "Step 1/4: Installing Frontend Dependencies..." -ForegroundColor Yellow
Set-Location "$PROJECT_ROOT\frontend"
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "Frontend dependencies installed!" -ForegroundColor Green
} else {
    Write-Host "Error installing frontend dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Create Conda Environment
Write-Host "Step 2/4: Setting up Conda Environment..." -ForegroundColor Yellow
Set-Location "$PROJECT_ROOT\backend"

Write-Host "Creating conda environment 'brainhealth'..." -ForegroundColor Gray
conda create -n brainhealth python=3.10 -y

Write-Host "Activating environment and installing dependencies..." -ForegroundColor Gray
conda activate brainhealth
pip install -r requirements.txt

if ($LASTEXITCODE -eq 0) {
    Write-Host "Backend environment setup complete!" -ForegroundColor Green
} else {
    Write-Host "Error installing backend dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Create Model
Write-Host "Step 3/4: Creating AI Model..." -ForegroundColor Yellow
Write-Host "This may take 1-2 minutes..." -ForegroundColor Gray
python train_model.py --dummy

if ($LASTEXITCODE -eq 0) {
    Write-Host "AI model created successfully!" -ForegroundColor Green
} else {
    Write-Host "Model creation had issues (you can retry later)" -ForegroundColor Yellow
}

Write-Host ""

# Step 4: Summary
Write-Host "Step 4/4: Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installation Successful!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Start Backend (Terminal 1):" -ForegroundColor White
Write-Host "   conda activate brainhealth" -ForegroundColor Gray
Write-Host "   cd '$PROJECT_ROOT\backend'" -ForegroundColor Gray
Write-Host "   python main.py" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start Frontend (Terminal 2):" -ForegroundColor White
Write-Host "   cd '$PROJECT_ROOT\frontend'" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Open Browser:" -ForegroundColor White
Write-Host "   http://localhost:3000" -ForegroundColor Gray
Write-Host ""
Write-Host "Or use: .\start-conda.ps1" -ForegroundColor Cyan
Write-Host ""
