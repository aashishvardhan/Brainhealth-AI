# 🚀 Quick Firebase Deployment Steps

## Status: ✅ Configuration Complete, Ready to Deploy!

### What's Been Done:
1. ✅ Firebase CLI installed
2. ✅ `firebase.json` configured for Next.js static export
3. ✅ `.firebaserc` created with project name
4. ✅ `next.config.js` updated for static export
5. ✅ Frontend built successfully (11 pages exported to `/out`)

---

## Next Steps to Deploy:

### Step 1: Login to Firebase
```powershell
firebase login
```
This will open your browser for Google authentication.

### Step 2: Create Firebase Project (First Time Only)
1. Go to https://console.firebase.google.com/
2. Click **"Add Project"**
3. Enter name: `brainhealth-ai` (or your preferred name)
4. Disable Google Analytics (optional)
5. Click **"Create Project"**

### Step 3: Update Project ID (if different)
If you used a different project name, update `.firebaserc`:
```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

### Step 4: Deploy
```powershell
firebase deploy
```

After deployment completes, you'll get URLs like:
- **Primary**: `https://brainhealth-ai.web.app`
- **Alternate**: `https://brainhealth-ai.firebaseapp.com`

---

## 🌐 Your Free Domain Options:

### Included with Firebase (Free Forever):
- `https://your-project.web.app`
- `https://your-project.firebaseapp.com`
- ✅ Free SSL certificate
- ✅ Global CDN
- ✅ No cost for hosting

### Add Custom Domain (Optional):
1. In Firebase Console → **Hosting** → **Add custom domain**
2. Enter your domain (e.g., `brainhealth.ai`)
3. Verify ownership via DNS TXT record
4. Add DNS A records (Firebase provides IPs)
5. Wait 24-48 hours for DNS propagation

**Popular Domain Registrars:**
- Namecheap: ~$10-15/year (.com)
- GoDaddy: ~$10-20/year
- Google Domains: ~$12/year
- Cloudflare: ~$10/year (+ free CDN)

---

## 📊 What's Deployed:

Your static export includes:
- ✅ Home page (159 KB)
- ✅ Detection page (153 KB) - AI stroke detection
- ✅ Analytics dashboard (149 KB)
- ✅ Chatbot page (150 KB)
- ✅ Learn page (128 KB)
- ✅ Tools page (127 KB)
- ✅ About page (128 KB)
- ✅ Share page (149 KB)

**Total First Load**: ~88-159 KB per page (excellent!)

---

## ⚡ Backend Deployment

Since Firebase only hosts static files, deploy your FastAPI backend separately:

### Option 1: Render.com (Recommended - Free)
```bash
1. Go to render.com
2. New → Web Service
3. Connect GitHub repo
4. Root: backend/
5. Build: pip install -r requirements.txt
6. Start: uvicorn main:app --host 0.0.0.0 --port $PORT
7. Deploy!
```
Free tier: 750 hours/month, auto-sleep after 15min

### Option 2: Railway.app (Free)
```bash
1. Go to railway.app
2. New Project → Deploy from GitHub
3. Select backend/ folder
4. Auto-deploys Python apps
```

### Option 3: Vercel (Next.js + Serverless)
```bash
vercel deploy
```
Note: May need to convert FastAPI to serverless functions

---

## 🔗 Update API URL

After deploying backend, update frontend environment:

Create `frontend/.env.production`:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

Then rebuild and redeploy:
```powershell
cd frontend
npm run build
cd ..
firebase deploy
```

---

## 📝 Deployment Checklist

Before going live:
- [ ] Firebase project created
- [ ] Backend deployed to Render/Railway
- [ ] `NEXT_PUBLIC_API_URL` updated
- [ ] Frontend rebuilt with new API URL
- [ ] Deployed to Firebase
- [ ] Tested all pages work
- [ ] CORS configured on backend for your domain
- [ ] Custom domain added (optional)

---

## 🆘 Troubleshooting

### Build Fails
```powershell
cd frontend
rm -r .next
npm install
npm run build
```

### Deploy Permission Error
```powershell
firebase login --reauth
```

### 404 on Page Refresh
Already handled in `firebase.json` with rewrites!

### API Not Working
1. Check `NEXT_PUBLIC_API_URL` in production
2. Update backend CORS to allow your domain:
```python
allow_origins=["https://brainhealth-ai.web.app"]
```

---

## 💰 Cost Estimate

### Free Tier (Generous):
- **Firebase Hosting**: 10 GB storage, 360 MB/day transfer
- **Expected Traffic**: ~10-50K visitors/month (free)
- **Backend (Render)**: 750 hours/month
- **SSL Certificate**: Free
- **Total Monthly**: $0

### If You Exceed Free Tier:
- Firebase: ~$0.15/GB storage, ~$0.15/GB transfer
- Typical cost for 100K visits: ~$1-3/month
- Backend upgrade: $7/month (Render Pro)

---

## 🎯 Your Commands:

```powershell
# 1. Login
firebase login

# 2. Deploy
firebase deploy

# 3. View your site
# Check terminal output for your URL!
```

---

Made with ❤️ for BrainHealth AI
**Ready to deploy? Run: `firebase login` → `firebase deploy`**
