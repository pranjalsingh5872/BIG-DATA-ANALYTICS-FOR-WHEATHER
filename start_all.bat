@echo off
echo =========================================================================
echo Starting National Weather Big Data Analytics Platform (SIH-26069)
echo =========================================================================

echo 1. Seeding Database with Initial Indian Weather Events...
python -m backend.seed_data

echo 2. Launching FastAPI Backend on http://localhost:8000 ...
start "Weather Backend API" cmd /k "python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo 3. Launching React / Vite Command Center on http://localhost:5173 ...
cd frontend
start "Weather Command Center" cmd /k "npm run dev"

echo =========================================================================
echo All services launched!
echo Dashboard: http://localhost:5173
echo API Docs:  http://localhost:8000/docs
echo =========================================================================
