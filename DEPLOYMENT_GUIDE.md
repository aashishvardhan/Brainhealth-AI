# 🚀 Firebase Deployment Guide for BrainHealth AI

## Prerequisites
- Node.js installed
- Google account for Firebase
- Firebase CLI installed

## Step-by-Step Deployment

### 1. Install Firebase CLI (if not installed)
```powershell
npm install -g firebase-tools
```

### 2. Login to Firebase
```powershell
firebase login
```
This will open your browser for Google authentication.

### 3. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name your project: `brainhealth-ai` (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create Project"

### 4. Update .firebaserc (if different project name)
If you used a different name, update `.firebaserc`:
```json
{
  "projects": {
    "default": "your-project-name"
  }
}
```

### 5. Build the Frontend
```powershell
cd frontend
npm run build
```
This creates an optimized static export in `frontend/out/`

### 6. Deploy to Firebase
```powershell
cd ..
firebase deploy
```

### 7. Access Your Site
After deployment completes, you'll get a URL like:
```
https://brainhealth-ai.web.app
https://brainhealth-ai.firebaseapp.com
```

## Custom Domain Setup

### Option 1: Free Firebase Domain
Your app automatically gets:
- `https://your-project.web.app`
- `https://your-project.firebaseapp.com`

### Option 2: Connect Custom Domain
1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter your domain (e.g., `brainhealth.ai`)
4. Follow DNS verification steps
5. Add DNS records to your domain provider:
   - Type: A
   - Name: @
   - Value: (Firebase IPs provided)
   - Type: TXT (for verification)

### Popular Domain Providers
- **Namecheap**: $8-15/year for .ai domains
- **GoDaddy**: $10-20/year
- **Google Domains**: $12/year
- **Hostinger**: $1-3/year for .com

## Backend Deployment Options

Since Firebase Hosting only serves static files, deploy your FastAPI backend separately:

### Option A: Render (Recommended - Free Tier)
1. Go to [Render.com](https://render.com)
2. Connect GitHub repository
3. Create "Web Service"
4. Set:
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Root Directory: `backend`
5. Deploy (free tier available)
6. Update `NEXT_PUBLIC_API_URL` in frontend

### Option B: Railway.app (Free Tier)
1. Go to [Railway.app](https://railway.app)
2. Connect GitHub
3. Deploy from `backend/` directory
4. Railway auto-detects Python and installs dependencies

### Option C: Google Cloud Run (Paid but scalable)
1. Build Docker image from `backend/Dockerfile`
2. Push to Google Container Registry
3. Deploy to Cloud Run
4. Get HTTPS endpoint

## Environment Variables

Update your frontend `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

Rebuild and redeploy after changing environment variables.

## Continuous Deployment

### Setup GitHub Actions
Create `.github/workflows/firebase-deploy.yml`:
```yaml
name: Deploy to Firebase
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: cd frontend && npm install && npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: brainhealth-ai
```

## Commands Reference

```powershell
# Login to Firebase
firebase login

# Initialize Firebase (if starting fresh)
firebase init hosting

# Build frontend
cd frontend
npm run build

# Test locally before deploying
firebase serve

# Deploy to Firebase
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# View deployment logs
firebase hosting:channel:list
```

## Troubleshooting

### Build Fails
```powershell
# Clear cache and rebuild
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

### 404 Errors on Refresh
Already configured in `firebase.json` with rewrites to handle Next.js routing.

### API CORS Issues
Update backend CORS settings to allow your Firebase domain:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://brainhealth-ai.web.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Cost Estimate

### Free Tier (Firebase)
- **Hosting**: 10 GB storage, 360 MB/day transfer
- **Bandwidth**: ~10-50K visits/month
- **Custom domain**: Free SSL, unlimited

### Paid Domain
- `.com`: $10-15/year
- `.ai`: $50-100/year
- `.health`: $80-120/year

### Backend (Render Free Tier)
- 750 hours/month (enough for 24/7)
- Auto-sleep after 15min inactivity
- Wakes up on request (~30s)

## Next Steps

1. ✅ Deploy frontend to Firebase
2. ✅ Deploy backend to Render/Railway
3. ✅ Connect custom domain
4. ✅ Set up SSL (automatic with Firebase)
5. ✅ Configure environment variables
6. ✅ Test end-to-end
7. ✅ Set up monitoring

## Support

- Firebase Docs: https://firebase.google.com/docs/hosting
- Render Docs: https://render.com/docs
- Need help? Check Firebase community forums

---

Made with ❤️ for BrainHealth AI
