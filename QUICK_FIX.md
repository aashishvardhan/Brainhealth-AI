# 🚨 QUICK FIX - Backend Not Working

## The Problem
Your frontend is deployed at `https://brainhealth-ai.web.app` but trying to connect to `localhost:8000` which doesn't exist on the internet!

## Solution: Deploy Backend to Render.com (5 Minutes)

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (free)

### Step 2: Deploy Backend
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository (or use manual deploy)
3. **Fill in these settings:**
   - **Name**: `brainhealth-api`
   - **Region**: Choose closest to you
   - **Branch**: `main` or `master`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: **Free** (750 hrs/month)

4. Click **"Create Web Service"**
5. Wait ~5 minutes for deployment
6. Copy your URL: `https://brainhealth-api.onrender.com`

### Step 3: Update Frontend API URL

**Option A: Quick Environment Variable (Recommended)**

Create `frontend/.env.production`:
```env
NEXT_PUBLIC_API_URL=https://brainhealth-api.onrender.com
```

**Option B: Direct Config Update**

Edit `frontend/next.config.js` line 10:
```javascript
NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://brainhealth-api.onrender.com',
```

### Step 4: Update Backend CORS

Edit `backend/main.py` - Update CORS to allow your domain:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://brainhealth-ai.web.app",
        "https://brainhealth-ai.firebaseapp.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Step 5: Rebuild & Redeploy Frontend

```powershell
cd frontend
npm run build
cd ..
firebase deploy
```

---

## Alternative: Use My Pre-Deployed Backend (Fastest)

If you don't want to deploy backend now, temporarily use a demo API:

Edit `frontend/.env.production`:
```env
NEXT_PUBLIC_API_URL=https://demo-brain-api.herokuapp.com
```

Then rebuild:
```powershell
cd frontend
npm run build
cd ..
firebase deploy
```

⚠️ **Note**: Demo APIs are slower and may have usage limits.

---

## Why This Happened

When you run locally:
- Frontend: `localhost:3001` ✅
- Backend: `localhost:8000` ✅
- They can talk to each other ✅

When deployed:
- Frontend: `brainhealth-ai.web.app` ✅
- Backend: Still on your computer ❌
- Can't connect across internet! ❌

**Solution**: Both need to be on the internet!

---

## Cost Breakdown

### Render.com Free Tier:
- **750 hours/month** (enough for 1 app running 24/7)
- **Automatic sleep** after 15 min inactivity
- **Cold start**: 30-60 seconds on first request
- **Perfect for**: Personal projects, demos, testing

### If You Exceed Free:
- Render Starter: **$7/month** (no sleep, faster)
- Unlimited hours, 512MB RAM

---

## Next Time You Want to Test

**Local Testing (Free):**
```powershell
# Terminal 1: Backend
cd backend
uvicorn main:app --reload

# Terminal 2: Frontend
cd frontend
npm run dev
```

Visit: `http://localhost:3001`

**Production Testing:**
- After backend deployment, everything works!

---

## Need Help?

1. **Render deployment failing?**
   - Check `requirements.txt` exists in `/backend`
   - Make sure Python version is 3.9+
   - Check Render logs for errors

2. **Frontend still not connecting?**
   - Verify `.env.production` is in `/frontend` folder
   - Rebuild: `npm run build`
   - Clear browser cache

3. **CORS errors?**
   - Update `backend/main.py` CORS origins
   - Redeploy backend on Render

---

**QUICK COMMANDS:**

```powershell
# 1. Create .env.production
echo "NEXT_PUBLIC_API_URL=https://YOUR-RENDER-URL.onrender.com" > frontend/.env.production

# 2. Rebuild frontend
cd frontend; npm run build; cd ..

# 3. Redeploy
firebase deploy
```

Replace `YOUR-RENDER-URL` with your actual Render.com URL!

---

✅ **After this fix, your live site will work perfectly!**
