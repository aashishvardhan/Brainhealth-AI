# Deploy Backend to Google Cloud Run

## Why Cloud Run for Your Backend?

✅ **Perfect for Firebase Users:**
- Same Google Cloud account as Firebase
- Integrates seamlessly with Firebase frontend
- Both managed by Google Cloud Console

✅ **Python + TensorFlow Support:**
- Runs Docker containers (supports any language)
- Handles large ML models easily
- No build size limits like Render

✅ **Free Tier:**
- 2 million requests/month FREE
- 180,000 vCPU-seconds/month FREE
- 360,000 GiB-seconds memory/month FREE
- More than enough for your app!

✅ **Permanent URL:**
- URL never changes after deployment
- Update code anytime, same URL

---

## Prerequisites

1. **Google Cloud Account** (same as Firebase)
   - Already have one if using Firebase!
   
2. **Install Google Cloud CLI:**
   - Download: https://cloud.google.com/sdk/docs/install
   - Or use Cloud Shell (web-based, no install needed)

---

## Deployment Steps

### **Option 1: Using Cloud Shell (Easiest - No Installation)**

1. **Open Google Cloud Console:**
   - Go to: https://console.cloud.google.com
   - Select your Firebase project: `brainhealth-ai`

2. **Open Cloud Shell:**
   - Click the terminal icon (>_) in top-right corner
   - A terminal opens in your browser

3. **Clone Your Repository:**
   ```bash
   git clone https://github.com/aashishvardhan/Brainhealth-AI.git
   cd Brainhealth-AI/backend
   ```

4. **Deploy to Cloud Run:**
   ```bash
   gcloud run deploy brainhealth-backend \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --memory 2Gi \
     --cpu 2 \
     --timeout 300
   ```

5. **Get Your Backend URL:**
   - Cloud Run will output: `Service URL: https://brainhealth-backend-xxxxx-uc.a.run.app`
   - Copy this URL!

6. **Test Your Backend:**
   ```bash
   curl https://YOUR-BACKEND-URL/docs
   ```

---

### **Option 2: Using Local Terminal (If gcloud CLI installed)**

1. **Login to Google Cloud:**
   ```powershell
   gcloud auth login
   gcloud config set project brainhealth-ai
   ```

2. **Navigate to Backend:**
   ```powershell
   cd "C:\Users\aashi\OneDrive\Desktop\BrainHealth AI\backend"
   ```

3. **Deploy:**
   ```powershell
   gcloud run deploy brainhealth-backend --source . --platform managed --region us-central1 --allow-unauthenticated --memory 2Gi --cpu 2 --timeout 300
   ```

4. **Copy the Service URL** from output

---

## Update Frontend to Use Cloud Run Backend

### **Step 1: Create Environment File**

Create `frontend/.env.production`:
```env
NEXT_PUBLIC_API_URL=https://brainhealth-backend-xxxxx-uc.a.run.app
```
*Replace with your actual Cloud Run URL*

### **Step 2: Update Frontend Code**

The detection page and other components should use this environment variable.

Check `frontend/src/app/detection/page.tsx` - it should have:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

### **Step 3: Rebuild Frontend**
```powershell
cd frontend
npm run build
```

### **Step 4: Redeploy to Firebase**
```powershell
firebase deploy
```

---

## Configuration Details

### **Dockerfile** (Already created in backend/)
- Uses Python 3.10
- Installs TensorFlow and dependencies
- Exposes port 8080 (Cloud Run requirement)
- Starts FastAPI with uvicorn

### **Environment Variables** (If needed later)
```bash
# Set environment variables in Cloud Run:
gcloud run services update brainhealth-backend \
  --set-env-vars="SKIP_TENSORFLOW=0,MODEL_PATH=models/stroke_cnn_model.h5"
```

### **Memory & CPU Settings**
- **Memory:** 2Gi (enough for TensorFlow + model)
- **CPU:** 2 (faster inference)
- **Timeout:** 300 seconds (5 mins for large uploads)

---

## Cost Estimate

### **Free Tier (Plenty for you):**
- 2 million requests/month
- ~555 hours of container runtime
- ~1000 GB of egress

### **Your Expected Usage:**
- 100 detections/day = 3,000/month
- Well within free tier!

### **If You Exceed Free Tier:**
- ~$0.40 per 1 million requests
- ~$0.00002400 per vCPU-second
- Still very cheap (~$2-5/month max)

---

## After Deployment

### **Your Architecture:**
```
Frontend: https://brainhealth-ai.web.app (Firebase Hosting)
    ↓
Backend: https://brainhealth-backend-xxxxx.run.app (Cloud Run)
    ↓
Model: stroke_cnn_model.h5 (deployed with backend)
```

### **Test Endpoints:**
- Health check: `https://YOUR-BACKEND-URL/`
- API docs: `https://YOUR-BACKEND-URL/docs`
- Detect stroke: `POST https://YOUR-BACKEND-URL/api/detect-stroke`
- Generate PDF: `POST https://YOUR-BACKEND-URL/api/generate-report`
- Find hospitals: `GET https://YOUR-BACKEND-URL/api/hospitals?lat=28.6&lon=77.2`

### **Monitor Your App:**
- Go to: https://console.cloud.google.com/run
- View logs, metrics, and requests
- See costs and usage

---

## Troubleshooting

### **Build Fails:**
```bash
# Check logs in Cloud Console
# Or use:
gcloud run services logs read brainhealth-backend
```

### **Out of Memory:**
```bash
# Increase memory to 4Gi:
gcloud run services update brainhealth-backend --memory 4Gi
```

### **Timeout Issues:**
```bash
# Increase timeout:
gcloud run services update brainhealth-backend --timeout 600
```

### **Model Not Found:**
- Ensure `models/stroke_cnn_model.h5` is in your backend folder
- Check training completed successfully
- Verify file is committed to Git

---

## Summary

**Instead of Firebase for backend, use:**
- **Frontend:** Firebase Hosting (already done ✅)
- **Backend:** Google Cloud Run (same Google account!)

**Benefits:**
- ✅ Same ecosystem (Google)
- ✅ Permanent URLs (never change)
- ✅ Generous free tiers
- ✅ Python + TensorFlow support
- ✅ Easy integration

**Next Step:**
1. Open https://console.cloud.google.com
2. Click Cloud Shell icon (>_)
3. Run the deployment commands above
4. Get your backend URL
5. Update frontend and redeploy

---

**Ready to deploy?** I can guide you through each step! 🚀
