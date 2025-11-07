# ✅ BrainHealth AI - Installation Checklist

## Before You Start

### Step 1: Install Node.js ⚠️ REQUIRED

- [ ] Download Node.js from: https://nodejs.org/
- [ ] Choose **LTS (Long Term Support)** version
- [ ] Run the installer
- [ ] ⚠️ **IMPORTANT:** Check "Add to PATH" option
- [ ] Restart PowerShell/Terminal
- [ ] Verify installation:
  ```powershell
  node --version
  npm --version
  ```
  Should show versions (e.g., v20.11.0 and 10.2.4)

**If you see "npm is not recognized" error, Node.js is not installed correctly!**

---

### Step 2: Install Python ⚠️ REQUIRED

- [ ] Download Python from: https://www.python.org/downloads/
- [ ] Choose **Python 3.10 or higher**
- [ ] Run the installer
- [ ] ⚠️ **IMPORTANT:** Check "Add Python to PATH" option
- [ ] Restart PowerShell/Terminal
- [ ] Verify installation:
  ```powershell
  python --version
  pip --version
  ```
  Should show versions (e.g., 3.11.5 and pip 23.2.1)

**If you see "python is not recognized" error, Python is not installed correctly!**

---

## After Prerequisites Are Installed

### Step 3: Install Project Dependencies

#### Option A: Automatic Installation (Easiest)

```powershell
cd "c:\Users\aashi\OneDrive\Desktop\BrainHealth AI"
.\install.ps1
```

The script will:
- ✅ Check if Node.js and Python are installed
- ✅ Install all frontend dependencies
- ✅ Create Python virtual environment
- ✅ Install all backend dependencies
- ✅ Create AI model for testing

#### Option B: Manual Installation

**Frontend:**
```powershell
cd "c:\Users\aashi\OneDrive\Desktop\BrainHealth AI\frontend"
npm install
```

**Backend:**
```powershell
cd "c:\Users\aashi\OneDrive\Desktop\BrainHealth AI\backend"
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python train_model.py --dummy
```

---

### Step 4: Run the Application

#### Option A: Automatic Start (Easiest)

```powershell
cd "c:\Users\aashi\OneDrive\Desktop\BrainHealth AI"
.\start.ps1
```

#### Option B: Manual Start

**Terminal 1 - Backend:**
```powershell
cd "c:\Users\aashi\OneDrive\Desktop\BrainHealth AI\backend"
python main.py
```

**Terminal 2 - Frontend:**
```powershell
cd "c:\Users\aashi\OneDrive\Desktop\BrainHealth AI\frontend"
npm run dev
```

---

### Step 5: Open in Browser

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

## ❌ Common Errors & Solutions

### Error: "npm is not recognized"

**Cause:** Node.js not installed or not in PATH

**Solution:**
1. Install Node.js from https://nodejs.org/
2. Make sure "Add to PATH" is checked
3. Restart PowerShell
4. Try again

### Error: "python is not recognized"

**Cause:** Python not installed or not in PATH

**Solution:**
1. Install Python from https://www.python.org/downloads/
2. Make sure "Add Python to PATH" is checked
3. Restart PowerShell
4. Try again

### Error: TypeScript errors in VS Code

**Cause:** Dependencies not installed yet

**Solution:**
1. Run `npm install` in frontend directory
2. Errors will disappear automatically

### Error: Port already in use

**Solution:**
```powershell
# Use different port for frontend
npm run dev -- -p 3001

# Or kill process using the port
```

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `README.md` | Complete documentation (15+ pages) |
| `INSTALLATION.md` | Detailed installation & troubleshooting |
| `SETUP.md` | Quick setup guide |
| `GET_STARTED.md` | Beginner-friendly walkthrough |
| `PROJECT_SUMMARY.md` | Project overview |
| This file | Installation checklist |

---

## ✅ Success Indicators

You'll know everything is working when:

- ✅ `npm --version` shows version number
- ✅ `python --version` shows 3.10 or higher
- ✅ `npm install` completes without errors
- ✅ Backend starts and shows "Uvicorn running on http://0.0.0.0:8000"
- ✅ Frontend starts and shows "ready started server on 0.0.0.0:3000"
- ✅ http://localhost:3000 loads in browser
- ✅ No TypeScript errors in VS Code

---

## 🆘 Still Need Help?

1. **Read INSTALLATION.md** - Comprehensive troubleshooting guide
2. **Check error messages** - They usually tell you what's wrong
3. **Verify prerequisites** - Make sure Node.js and Python are installed
4. **Restart terminal** - Always restart after installing software
5. **Try clean install** - Delete node_modules and venv, reinstall

---

## 🎉 You're Ready!

Once everything is installed and running:

1. Test stroke detection by uploading an image
2. Chat with the AI bot
3. Explore the hospital map
4. Check out all the features
5. Deploy to Vercel + Render (free!)

**Enjoy building with BrainHealth AI!** 🧠✨
