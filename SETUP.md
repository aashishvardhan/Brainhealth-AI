# 🚀 BrainHealth AI - Setup & Installation Guide

## Quick Setup (5 minutes)

### Step 1: Install Dependencies

#### Frontend
```powershell
cd frontend
npm install
```

#### Backend
```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Step 2: Create Model

```powershell
cd backend
python train_model.py --dummy
```

### Step 3: Run the App

**Terminal 1 - Backend:**
```powershell
cd backend
python main.py
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### Step 4: Open Browser

Visit: `http://localhost:3000`

---

## 🎯 Project Complete!

You now have:
- ✅ Next.js 14 frontend with Tailwind & Framer Motion
- ✅ FastAPI backend with CNN model
- ✅ HuggingFace chatbot integration
- ✅ OpenStreetMap hospital finder
- ✅ Fully responsive, professional UI
- ✅ Ready for deployment on Vercel + Render

---

## 📦 What's Included

### Frontend (`/frontend`)
- Home page with hero, features, stats
- Stroke detection with image upload
- AI chatbot interface  
- Hospital finder with interactive map
- Neurology knowledge hub
- Health tools (BMI, BP, stress)
- About page
- Professional animations & UI

### Backend (`/backend`)
- FastAPI server with auto-docs
- CNN stroke detection model
- HuggingFace chatbot (Blenderbot)
- OpenStreetMap hospital API
- Model training script
- Dockerfile for deployment

---

## 🚀 Deployment

### Frontend → Vercel
1. Push to GitHub
2. Import to Vercel
3. Set `NEXT_PUBLIC_API_URL`
4. Deploy!

### Backend → Render
1. Connect GitHub repo
2. Select Docker
3. Deploy (free tier)

---

## 🛠️ Troubleshooting

**Port already in use?**
```powershell
# Change port in backend/main.py (line 419)
# Change NEXT_PUBLIC_API_URL in frontend/.env.local
```

**Model not loading?**
```powershell
cd backend
python train_model.py --dummy
```

**Dependencies issue?**
```powershell
# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install

# Backend  
cd backend
pip install --upgrade pip
pip install -r requirements.txt
```

---

## 📝 Next Steps

1. **Customize branding** - Update colors, logo, text
2. **Train real model** - Use actual medical dataset
3. **Add authentication** - User accounts & history
4. **Enhance chatbot** - Fine-tune on medical data
5. **Add features** - Email reports, multi-language support

---

## 💡 Tips

- Use `npm run build` to test production build
- Check `/api/health` endpoint to verify backend
- Visit `http://localhost:8000/docs` for API docs
- Star the repo if you found it useful! ⭐

---

Enjoy building with BrainHealth AI! 🧠✨
