# 🚀 RENDER DEPLOYMENT - STEP BY STEP

## ✅ What's Ready:
- Git repository initialized and committed
- Backend configured for Render
- All files ready to deploy

---

## 📝 **STEP 1: Create GitHub Repository** (2 minutes)

### In Your Browser:
1. Go to: **https://github.com/new**
2. Fill in:
   - **Repository name**: `BrainHealth-AI`
   - **Description**: `AI-Powered Brain Stroke Detection Platform`
   - **Visibility**: **Public** (required for Render free tier)
3. ❌ **DO NOT** check "Initialize with README" (we already have files)
4. Click **"Create repository"**

### Copy the commands shown and run in terminal:
```powershell
git remote add origin https://github.com/YOUR-USERNAME/BrainHealth-AI.git
git branch -M main
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username!

---

## 📝 **STEP 2: Deploy to Render** (3 minutes)

### In Render.com Browser Window (already open):

1. Click **"New +"** → **"Web Service"**

2. Click **"Build and deploy from a Git repository"** → **"Next"**

3. **Connect GitHub Repository:**
   - If first time: Click **"Connect GitHub"**
   - Find: **BrainHealth-AI**
   - Click **"Connect"**

4. **Configure the Service:**

| Field | Value |
|-------|-------|
| **Name** | `brainhealth-api` |
| **Region** | Singapore (or closest) |
| **Branch** | `main` |
| **Root Directory** | `backend` ⚠️ IMPORTANT |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | **Free** |

5. **Advanced Settings** (Optional but recommended):
   Click "Advanced" and add environment variables:
   - `PYTHON_VERSION` = `3.11.0`
   - `SKIP_TENSORFLOW` = `0`

6. Click **"Create Web Service"**

---

## ⏱️ **STEP 3: Wait for Deployment** (5-10 minutes)

Watch the logs. You'll see:
```
==> Cloning from https://github.com/YOUR-USERNAME/BrainHealth-AI...
==> Installing dependencies
==> Building application
==> Starting service
==> Your service is live at https://brainhealth-api.onrender.com
```

**Note:** First deployment takes 5-10 minutes due to TensorFlow installation.

---

## 📋 **STEP 4: Copy Your Backend URL**

Once deployed, you'll see:
```
🎉 Your service is live at https://brainhealth-api.onrender.com
```

**Copy this URL!**

---

## 📝 **STEP 5: Update Frontend**

### Create production environment file:
```powershell
echo "NEXT_PUBLIC_API_URL=https://brainhealth-api.onrender.com" > frontend/.env.production
```

Replace `brainhealth-api.onrender.com` with your actual Render URL!

### Rebuild frontend:
```powershell
cd frontend
npm run build
cd ..
```

### Redeploy to Firebase:
```powershell
firebase deploy
```

---

## ✅ **STEP 6: Test!**

Visit: **https://brainhealth-ai.web.app/detection**

1. Upload a brain scan
2. Click "Analyze Scan"
3. **It should work with REAL AI now!** 🎉

No more demo mode banner!

---

## 🔧 **Troubleshooting**

### "Build Failed - Out of Memory"
**Solution:** TensorFlow is too heavy. Use lite mode:
```python
# In backend/main.py, add at top:
os.environ['SKIP_TENSORFLOW'] = '1'
```

### "Repository not found"
**Solution:** Make sure repo is PUBLIC on GitHub

### "Deploy timeout"
**Solution:** 
1. Render Dashboard → Service
2. Settings → Build Timeout: 20 minutes
3. Manual Deploy → Clear build cache → Deploy

### CORS Errors Still
**Solution:** Already fixed in main.py! Just make sure you redeployed after recent commit.

---

## 💡 **Pro Tips**

**Free Tier Limitations:**
- Auto-sleeps after 15 min inactivity
- First request after sleep: 30-60 second cold start
- 750 hours/month (enough for 24/7)

**To Keep Always Active:**
- Use Render Starter plan ($7/mo)
- Or use cron job to ping every 14 minutes

**Check Logs:**
- Render Dashboard → Your Service → Logs
- See real-time API requests and errors

---

## 📊 **What Happens Next**

✅ Backend: Live on Render with real AI
✅ Frontend: Live on Firebase
✅ Full stack working together!

Your complete URL:
- **Frontend**: https://brainhealth-ai.web.app
- **Backend API**: https://your-app.onrender.com
- **API Docs**: https://your-app.onrender.com/docs

---

## 🎯 **READY? START NOW!**

### Quick Commands:
```powershell
# 1. Create GitHub repo at github.com/new
# 2. Then run:
git remote add origin https://github.com/YOUR-USERNAME/BrainHealth-AI.git
git push -u origin main

# 3. Go to render.com and deploy
# 4. Copy URL and update frontend:
echo "NEXT_PUBLIC_API_URL=https://YOUR-RENDER-URL.onrender.com" > frontend/.env.production

# 5. Rebuild and redeploy:
cd frontend; npm run build; cd ..; firebase deploy
```

**Let's do this! 🚀**
