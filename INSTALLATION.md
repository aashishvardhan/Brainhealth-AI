# 🔧 Installation & Troubleshooting Guide

## ⚠️ Prerequisites

Before installing BrainHealth AI, ensure you have:

### Required Software

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
   - Includes npm (Node Package Manager)
   - Verify installation: `node --version` and `npm --version`

2. **Python** (v3.10 or higher) - [Download here](https://www.python.org/downloads/)
   - Make sure to check "Add Python to PATH" during installation
   - Verify installation: `python --version`

3. **Git** (optional, for deployment) - [Download here](https://git-scm.com/)

---

## 🚀 Installation Steps

### Step 1: Install Node.js

If you see error: `npm : The term 'npm' is not recognized`

**Solution:**
1. Download Node.js from https://nodejs.org/ (choose LTS version)
2. Run the installer
3. **Important:** Check "Add to PATH" option
4. Restart PowerShell/Terminal
5. Verify: `node --version` should show v18.x.x or higher

### Step 2: Install Python

If you see error: `python : The term 'python' is not recognized`

**Solution:**
1. Download Python from https://www.python.org/downloads/
2. Run installer
3. **Important:** Check "Add Python to PATH" during installation
4. Restart PowerShell/Terminal
5. Verify: `python --version` should show 3.10.x or higher

### Step 3: Install Project Dependencies

Once Node.js and Python are installed:

#### Frontend Dependencies
```powershell
cd "c:\Users\aashi\OneDrive\Desktop\BrainHealth AI\frontend"
npm install
```

This installs:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Axios
- React Leaflet
- Lucide React
- And all other dependencies

#### Backend Dependencies
```powershell
cd "c:\Users\aashi\OneDrive\Desktop\BrainHealth AI\backend"
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

This installs:
- FastAPI
- TensorFlow
- Transformers (HuggingFace)
- Pillow
- NumPy
- Uvicorn
- And all other dependencies

### Step 4: Create AI Model

```powershell
cd "c:\Users\aashi\OneDrive\Desktop\BrainHealth AI\backend"
python train_model.py --dummy
```

This creates a dummy CNN model for testing.

---

## 🐛 Common Errors & Solutions

### Error 1: "npm is not recognized"

**Cause:** Node.js not installed or not in PATH

**Solution:**
```powershell
# Check if Node.js is installed
node --version

# If not found, install from https://nodejs.org/
# After installation, restart PowerShell and try again
```

### Error 2: "python is not recognized"

**Cause:** Python not installed or not in PATH

**Solution:**
```powershell
# Check if Python is installed
python --version

# If not found, install from https://www.python.org/
# Make sure to check "Add to PATH" during installation
```

### Error 3: TypeScript/Import Errors in Frontend

**Cause:** Dependencies not installed

**Solution:**
```powershell
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Error 4: "Cannot find module" errors

**Cause:** Dependencies not installed properly

**Solution:**
```powershell
# Frontend
cd frontend
npm install

# Backend
cd backend
pip install -r requirements.txt
```

### Error 5: Port Already in Use

**Cause:** Port 3000 or 8000 already taken

**Solution:**
```powershell
# Frontend - use different port
npm run dev -- -p 3001

# Backend - edit main.py line 419
# Change: uvicorn.run(app, host="0.0.0.0", port=8001)
```

### Error 6: Model Not Found

**Cause:** AI model not created

**Solution:**
```powershell
cd backend
python train_model.py --dummy
```

### Error 7: Virtual Environment Issues (Backend)

**Cause:** venv not activated or corrupted

**Solution:**
```powershell
# Delete old venv
rm -rf venv

# Create new
python -m venv venv

# Activate
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Error 8: Permission Denied

**Cause:** Need admin rights

**Solution:**
Run PowerShell as Administrator:
1. Right-click PowerShell
2. Select "Run as Administrator"
3. Try installation again

---

## ✅ Verification Checklist

After installation, verify everything works:

```powershell
# Check Node.js
node --version    # Should show v18+ or v20+

# Check npm
npm --version     # Should show 9+ or 10+

# Check Python
python --version  # Should show 3.10+ or 3.11+

# Check pip
pip --version     # Should show version info

# Check frontend dependencies
cd frontend
npm list --depth=0

# Check backend dependencies
cd backend
pip list
```

---

## 🚀 Running the Application

### Method 1: Manual Start (Recommended for First Time)

**Terminal 1 - Backend:**
```powershell
cd "c:\Users\aashi\OneDrive\Desktop\BrainHealth AI\backend"
venv\Scripts\activate
python main.py
```

Expected output:
```
🧠 BrainHealth AI - FastAPI Backend Starting...
📍 API Docs: http://localhost:8000/docs
✨ Press Ctrl+C to quit
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Terminal 2 - Frontend:**
```powershell
cd "c:\Users\aashi\OneDrive\Desktop\BrainHealth AI\frontend"
npm run dev
```

Expected output:
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

**Open Browser:**
- http://localhost:3000 (Frontend)
- http://localhost:8000/docs (API Documentation)

### Method 2: Automated Start (After First Successful Run)

```powershell
cd "c:\Users\aashi\OneDrive\Desktop\BrainHealth AI"
.\start.ps1
```

---

## 📦 Package Versions

### Frontend (package.json)
- next: 14.2.5
- react: 18.3.1
- typescript: 5.5.4
- tailwindcss: 3.4.7
- framer-motion: 11.3.28
- axios: 1.7.2
- react-leaflet: 4.2.1
- lucide-react: 0.426.0

### Backend (requirements.txt)
- fastapi: 0.104.1
- uvicorn: 0.24.0
- tensorflow: 2.15.0
- transformers: 4.35.2
- pillow: 10.1.0
- numpy: 1.26.2

---

## 🔍 Debugging Tips

### Check if servers are running:

```powershell
# Check if backend is running
curl http://localhost:8000/api/health

# Check if frontend is running
curl http://localhost:3000
```

### View detailed errors:

```powershell
# Frontend - check terminal output
npm run dev

# Backend - check terminal output
python main.py

# Check browser console (F12) for frontend errors
```

### Clear caches:

```powershell
# Frontend
cd frontend
rm -rf .next node_modules
npm install

# Backend
cd backend
rm -rf __pycache__
pip install --upgrade pip
pip install -r requirements.txt
```

---

## 💻 System Requirements

### Minimum:
- **OS:** Windows 10/11, macOS 10.15+, Linux
- **RAM:** 4 GB
- **Storage:** 2 GB free space
- **CPU:** Dual-core processor

### Recommended:
- **OS:** Windows 11, macOS 12+, Ubuntu 22.04+
- **RAM:** 8 GB or more
- **Storage:** 5 GB free space
- **CPU:** Quad-core processor

---

## 🆘 Still Having Issues?

### Option 1: Check Documentation
- Read `README.md` for comprehensive guide
- Check `SETUP.md` for quick setup
- Review `GET_STARTED.md` for walkthrough

### Option 2: Clean Install

```powershell
# Delete everything and start fresh
cd "c:\Users\aashi\OneDrive\Desktop\BrainHealth AI"

# Frontend
cd frontend
rm -rf node_modules package-lock.json .next
npm install

# Backend
cd backend
rm -rf venv __pycache__
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python train_model.py --dummy
```

### Option 3: Check Logs

```powershell
# Frontend logs
cd frontend
npm run dev > frontend.log 2>&1

# Backend logs
cd backend
python main.py > backend.log 2>&1

# Review the .log files for detailed error messages
```

---

## 📞 Getting Help

If you're still stuck:

1. **Check the error message carefully**
2. **Google the specific error**
3. **Check if prerequisites are installed**
4. **Try the clean install steps above**
5. **Create a GitHub issue with:**
   - Error message
   - Steps you tried
   - System information (OS, Node version, Python version)

---

## ✨ Success!

Once everything is installed, you should see:

✅ No TypeScript errors in frontend  
✅ Backend starts without errors  
✅ Frontend loads at http://localhost:3000  
✅ API docs load at http://localhost:8000/docs  
✅ All features work (detection, chatbot, maps)  

**Enjoy building with BrainHealth AI!** 🧠✨

---

<div align="center">

**Made with ❤️ for better brain health**

[⬆ Back to Top](#-installation--troubleshooting-guide)

</div>
