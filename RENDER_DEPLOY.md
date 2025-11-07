# 🚀 Deploy Backend to Render.com - Step by Step

## ⚡ FASTEST METHOD: Deploy via GitHub (5 minutes)

### Prerequisites
- GitHub account
- Your code should be in a GitHub repository

---

## Method 1: Deploy from GitHub (Recommended)

### Step 1: Push Code to GitHub (if not already)

```powershell
# Initialize git if not already done
cd "c:\Users\aashi\OneDrive\Desktop\BrainHealth AI"
git init
git add .
git commit -m "Deploy BrainHealth AI backend"

# Create repo on GitHub.com (do this in browser):
# 1. Go to https://github.com/new
# 2. Repository name: BrainHealth-AI
# 3. Make it Public or Private
# 4. Don't initialize with README (we already have files)
# 5. Click "Create repository"

# Push to GitHub (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/BrainHealth-AI.git
git branch -M main
git push -u origin main
```

### Step 2: Connect Render to GitHub

1. Go to **https://render.com**
2. Click **"Sign Up"** → **"Sign up with GitHub"**
3. Authorize Render to access your repositories

### Step 3: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Click **"Connect a repository"**
3. Find **"BrainHealth-AI"** and click **"Connect"**

### Step 4: Configure Service

**Fill in these exact settings:**

| Setting | Value |
|---------|-------|
| **Name** | `brainhealth-api` |
| **Region** | Singapore (or closest to you) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | **Free** |

### Step 5: Advanced Settings (Optional)

Click **"Advanced"** and add:

| Environment Variable | Value |
|---------------------|-------|
| `PYTHON_VERSION` | `3.11.0` |
| `SKIP_TENSORFLOW` | `0` |

### Step 6: Deploy!

1. Click **"Create Web Service"**
2. Wait ~5-10 minutes for:
   - Installing Python dependencies
   - Building TensorFlow
   - Starting uvicorn server
3. Watch the logs for progress

### Step 7: Get Your URL

Once deployed, you'll see:
```
Your service is live at https://brainhealth-api.onrender.com
```

**Copy this URL!** You'll need it for the frontend.

---

## Method 2: Manual Deploy (No GitHub needed)

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with email (no GitHub needed)

### Step 2: Deploy via Blueprint

1. Click **"New +"** → **"Blueprint"**
2. Upload your `render.yaml` file from `/backend` folder
3. Follow the deployment wizard

---

## Method 3: Deploy via Render CLI (Advanced)

### Install Render CLI
```powershell
npm install -g render-cli
render login
```

### Deploy
```powershell
cd backend
render deploy
```

---

## ✅ Verify Deployment

Once deployed, test your API:

### Check Health Endpoint
```powershell
curl https://brainhealth-api.onrender.com/
```

Expected response:
```json
{
  "message": "BrainHealth AI API",
  "version": "1.0.0",
  "status": "running"
}
```

### Test Stroke Detection
```powershell
# This will return available endpoints
curl https://brainhealth-api.onrender.com/docs
```

You should see the Swagger UI!

---

## 📊 Deployment Status

**Check deployment logs:**
1. Go to Render Dashboard
2. Click your service
3. Click **"Logs"** tab
4. Look for:
   ```
   ✅ TensorFlow loaded successfully
   INFO: Application startup complete
   INFO: Uvicorn running on http://0.0.0.0:$PORT
   ```

**Common build messages:**
- `Installing dependencies...` - Installing Python packages
- `Building wheels...` - Compiling TensorFlow
- `Starting service...` - Running uvicorn
- `Deploy live!` - **SUCCESS!** 🎉

---

## ⚠️ Troubleshooting

### Build Fails - Memory Error
**Solution:** TensorFlow is too large for free tier
```python
# Edit backend/main.py - Add at top:
os.environ['SKIP_TENSORFLOW'] = '1'
```
Then redeploy. This uses lite mode (no AI, but faster).

### Build Timeout
**Solution:** Increase build time
1. Render Dashboard → Service Settings
2. Build Timeout: 20 minutes
3. Click **"Save Changes"**

### Port Already in Use
**Solution:** Use Render's $PORT variable (already configured in start command)

### CORS Errors
**Solution:** Already fixed! Your Firebase domain is whitelisted in `main.py`

---

## 🔄 After Deployment

### Update Frontend

Create `frontend/.env.production`:
```env
NEXT_PUBLIC_API_URL=https://brainhealth-api.onrender.com
```

### Rebuild Frontend
```powershell
cd frontend
npm run build
cd ..
```

### Redeploy to Firebase
```powershell
firebase deploy
```

---

## 💰 Costs

### Free Tier (What You Get):
- ✅ 750 hours/month (31 days × 24 hours = 744 hours)
- ✅ Enough for 1 app running 24/7
- ✅ 512MB RAM
- ✅ Auto-sleep after 15 min inactivity
- ✅ Cold start: ~30-60 seconds

### Upgrade Options:
| Plan | Price | Features |
|------|-------|----------|
| **Starter** | $7/mo | No sleep, 512MB RAM |
| **Standard** | $25/mo | 2GB RAM, faster |
| **Pro** | $85/mo | 4GB RAM, priority |

**Recommendation:** Start with FREE, upgrade if needed.

---

## 🎯 Next Steps

1. ✅ Deploy backend to Render
2. ✅ Copy your Render URL
3. ✅ Update `frontend/.env.production`
4. ✅ Rebuild frontend
5. ✅ Deploy to Firebase
6. ✅ Test live site!

---

## 🆘 Need Help?

### Render Support
- Docs: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com

### Your Backend Files
All ready in `/backend`:
- ✅ `main.py` - Updated CORS for Firebase
- ✅ `requirements.txt` - All dependencies
- ✅ `render.yaml` - Deployment config
- ✅ `models/stroke_cnn_model.h5` - Trained AI model

---

**QUICK COMMANDS:**

```powershell
# After deploying backend on Render:

# 1. Create production env file
echo "NEXT_PUBLIC_API_URL=https://brainhealth-api.onrender.com" > frontend/.env.production

# 2. Rebuild frontend
cd frontend
npm run build
cd ..

# 3. Redeploy to Firebase
firebase deploy

# 4. Test your site
# Visit: https://brainhealth-ai.web.app/detection
```

Replace `brainhealth-api.onrender.com` with YOUR actual Render URL!

---

Made with ❤️ for BrainHealth AI
**Go to render.com now and deploy!** 🚀
