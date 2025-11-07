# 🐍 Anaconda/Conda Installation Guide

Since you have Anaconda installed, use these special scripts:

## Quick Start (3 Steps)

### Step 1: Initialize Conda for PowerShell

**First time only:**
```powershell
C:\Users\aashi\anaconda3\Scripts\conda.exe init powershell
```

**Then close and reopen PowerShell** (very important!)

---

### Step 2: Install Dependencies

```powershell
cd "c:\Users\aashi\OneDrive\Desktop\BrainHealth AI"
.\install-conda.ps1
```

This will:
- ✅ Create conda environment named `brainhealth`
- ✅ Install Python packages
- ✅ Install Node.js dependencies
- ✅ Create AI model

---

### Step 3: Start the Application

**Option A: Automatic (Easiest)**
```powershell
.\start-conda.ps1
```

**Option B: Manual Control**

Terminal 1 (Backend):
```powershell
conda activate brainhealth
cd backend
python main.py
```

Terminal 2 (Frontend):
```powershell
cd frontend
npm run dev
```

---

## Important Notes

### ⚠️ First Time Setup

1. **Initialize Conda** (one time only):
   ```powershell
   C:\Users\aashi\anaconda3\Scripts\conda.exe init powershell
   ```

2. **Restart PowerShell** - This is crucial! Close and open a new window.

3. **Then run install**:
   ```powershell
   .\install-conda.ps1
   ```

### 🔧 Troubleshooting

**Problem: "conda is not recognized"**

Solution:
```powershell
# Use full path to conda
C:\Users\aashi\anaconda3\Scripts\conda.exe init powershell

# Then RESTART PowerShell
```

**Problem: Environment activation fails**

Solution:
```powershell
# Use conda run instead
conda run -n brainhealth python backend/main.py
```

**Problem: Node.js not found**

Solution: Still need to install Node.js from https://nodejs.org/

---

## File Guide

| File | Use When |
|------|----------|
| `install-conda.ps1` | You have Anaconda installed |
| `start-conda.ps1` | Start app with Anaconda |
| `install.ps1` | You have standard Python (not Anaconda) |
| `start.ps1` | Start app with standard Python |

---

## Conda Commands Reference

```powershell
# See all conda environments
conda env list

# Activate environment
conda activate brainhealth

# Deactivate environment
conda deactivate

# Install package in environment
conda activate brainhealth
pip install package-name

# Remove environment (if needed)
conda env remove -n brainhealth
```

---

## ✅ Success Checklist

- [ ] Ran: `conda.exe init powershell`
- [ ] Restarted PowerShell
- [ ] Conda command works: `conda --version`
- [ ] Node.js installed: `node --version`
- [ ] Ran: `.\install-conda.ps1`
- [ ] No errors during installation
- [ ] Backend starts on port 8000
- [ ] Frontend starts on port 3000
- [ ] http://localhost:3000 loads in browser

---

## 🎯 Quick Reference

**Install everything:**
```powershell
.\install-conda.ps1
```

**Start everything:**
```powershell
.\start-conda.ps1
```

**Manual backend start:**
```powershell
conda activate brainhealth
python backend/main.py
```

**Manual frontend start:**
```powershell
npm run dev --prefix frontend
```

---

## Next Steps

Once installed:
1. ✅ Open http://localhost:3000
2. ✅ Test stroke detection
3. ✅ Try the chatbot
4. ✅ Explore hospital map
5. ✅ Deploy to Vercel + Render

Happy coding! 🧠
