# Deploy Backend to Railway.app

## Prerequisites
- GitHub repository: https://github.com/aashishvardhan/Brainhealth-AI
- Railway account (sign up with GitHub): https://railway.app/

## Step-by-Step Deployment

### 1. Create Railway Project
1. Go to https://railway.app/
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository: `aashishvardhan/Brainhealth-AI`

### 2. Configure Build Settings
1. In Railway dashboard, go to your project
2. Click "Settings" tab
3. Set **Root Directory**: `backend`
4. Set **Build Command**: `pip install -r requirements.txt`
5. Set **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 3. Add Environment Variables
In Railway Settings → Variables, add:
```
PORT=8000
SKIP_TENSORFLOW=0
```

### 4. Deploy
1. Railway will auto-deploy from your `main` branch
2. Wait for build to complete (may take 5-10 minutes for TensorFlow)
3. Railway will provide a URL like: `https://your-app.railway.app`

### 5. Get Your Backend URL
1. Go to Settings → Domains
2. Copy the generated domain (e.g., `brainhealth-ai-production.up.railway.app`)
3. Your API will be at: `https://brainhealth-ai-production.up.railway.app/api/`

### 6. Update Frontend
Update frontend to use Railway backend:

```bash
# In frontend/.env.production
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
```

Then rebuild and redeploy:
```bash
cd frontend
npm run build
firebase deploy
```

## Troubleshooting

### Build Fails
- Check logs in Railway dashboard
- Ensure requirements.txt has all dependencies
- May need to upgrade to paid tier ($5/month) for larger builds

### Memory Issues
- Railway free tier: 512MB RAM
- TensorFlow model needs ~200-300MB
- Should work, but may need $5 hobby plan for stability

### Timeouts
- Railway free tier has 100 second build timeout
- If TensorFlow takes too long, upgrade to paid tier

## Alternative: Google Cloud Run (If Railway Fails)

### Setup
1. Install Google Cloud SDK
2. Build Docker image:
```bash
cd backend
gcloud builds submit --tag gcr.io/brainhealth-ai/backend
```

3. Deploy:
```bash
gcloud run deploy backend \
  --image gcr.io/brainhealth-ai/backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Dockerfile for Cloud Run
Create `backend/Dockerfile`:
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD uvicorn main:app --host 0.0.0.0 --port $PORT
```

## Cost Comparison

| Platform | Free Tier | Paid Tier | Best For |
|----------|-----------|-----------|----------|
| Railway | $5 credit/month | $5-10/month | Quick deployment |
| Google Cloud Run | 2M requests/month | Pay per use | Production scaling |
| Heroku | None | $7/month | Simple apps |
| Fly.io | Limited free | $5-10/month | Edge deployment |
| DigitalOcean | None | $5/month | Stable pricing |

## Recommended Path

1. **Try Railway First** (free $5 credit)
   - Easiest setup with existing Procfile
   - Should handle TensorFlow fine
   
2. **If Railway limits exceeded** → Upgrade to Railway Hobby ($5/month)
   - More reliable for production
   - Better resources
   
3. **For maximum free tier** → Google Cloud Run
   - More setup required
   - Better for high traffic
   - 2M free requests/month

## Next Steps After Deployment

1. Test backend endpoint: `https://your-app.railway.app/docs`
2. Update frontend environment variable
3. Rebuild and redeploy frontend to Firebase
4. Test full workflow: Upload scan → Detection → Hospitals → PDF
5. Monitor Railway dashboard for usage/errors
