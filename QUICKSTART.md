# 🚀 RepoLens Quick Start Guide

Get RepoLens up and running in 5 minutes!

## Prerequisites Checklist

- [ ] Python 3.11+ installed
- [ ] `uv` package manager installed (`pip install uv`)
- [ ] Node.js 18+ and npm installed
- [ ] watsonx.ai API key and Project ID
- [ ] Git installed

## Step-by-Step Setup

### 1️⃣ Backend Setup (2 minutes)

```bash
# Navigate to backend directory
cd repolens-backend

# Create environment file
cp .env.example .env

# Edit .env and add your credentials:
# WATSONX_API_KEY=your_key_here
# WATSONX_PROJECT_ID=your_project_id
nano .env  # or use your preferred editor

# Install dependencies
uv sync

# Start the backend server
uv run uvicorn main:app --reload
```

✅ Backend should now be running at `http://localhost:8000`  
✅ Test it: Open `http://localhost:8000/docs` in your browser

### 2️⃣ Frontend Setup (2 minutes)

Open a **new terminal window**:

```bash
# Navigate to frontend directory
cd repolens-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

✅ Frontend should now be running at `http://localhost:3000`  
✅ Test it: Open `http://localhost:3000` in your browser

### 3️⃣ First Repository Ingestion (1 minute)

1. Open `http://localhost:3000` in your browser
2. Enter a small public GitHub repository URL:
   ```
   https://github.com/pallets/flask
   ```
3. Click **"Ingest"**
4. Wait for the progress bar to reach 100%
5. Ask your first question: **"What does this repository do?"**

## 🎉 Success!

You should now see:

- ✅ Backend API running on port 8000
- ✅ Frontend UI running on port 3000
- ✅ Repository successfully ingested
- ✅ AI-powered answers to your questions

## 🐛 Quick Troubleshooting

### Backend won't start

**Error:** `ModuleNotFoundError`

```bash
cd repolens-backend
uv sync
```

**Error:** `watsonx.ai authentication failed`

- Double-check your API key and project ID in `.env`
- Ensure no extra spaces or quotes

### Frontend won't start

**Error:** `Cannot find module`

```bash
cd repolens-frontend
rm -rf node_modules package-lock.json
npm install
```

**Error:** `Port 3000 already in use`

```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
# Or use a different port
npm run dev -- -p 3001
```

### Can't connect frontend to backend

1. Verify backend is running: `curl http://localhost:8000/api/health`
2. Check browser console for CORS errors
3. Verify `.env.local` has correct API URL

## 📊 System Requirements

### Minimum

- 4 GB RAM
- 2 CPU cores
- 5 GB disk space

### Recommended

- 8 GB RAM
- 4 CPU cores
- 10 GB disk space

## 🔥 Pro Tips

1. **Start with small repositories** (< 100 files) for faster ingestion
2. **Use specific questions** for better answers
3. **Check the sources** to see which files were referenced
4. **Keep backend logs visible** for debugging

## 📝 Example Workflow

```bash
# Terminal 1: Backend
cd repolens-backend
uv run uvicorn main:app --reload

# Terminal 2: Frontend
cd repolens-frontend
npm run dev

# Browser: http://localhost:3000
# 1. Ingest: https://github.com/user/small-repo
# 2. Wait for completion
# 3. Ask: "What does this repository do?"
# 4. Ask: "How is the main functionality implemented?"
```

## 🎯 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [ARCHITECTURE_BLUEPRINT.md](ARCHITECTURE_BLUEPRINT.md) for system design
- Review API docs at `http://localhost:8000/docs`
- Explore the codebase structure

## 🆘 Still Having Issues?

1. Check the [Troubleshooting section](README.md#-troubleshooting) in README.md
2. Review backend logs for detailed error messages
3. Verify all prerequisites are installed correctly
4. Try with a different, smaller repository

---

**Happy coding! 🚀**
