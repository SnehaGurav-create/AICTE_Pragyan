@echo off
echo ========================================================
echo   Starting PRAGYAN-AICTE Unified System
echo ========================================================
echo Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "PRAGYAN Backend (FastAPI)" cmd /k "cd /d %~dp0Backend && python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"

echo Starting React Vite Frontend on http://localhost:5173 ...
start "PRAGYAN Frontend (Vite React)" cmd /k "cd /d %~dp0Frontend && npm run dev"

echo.
echo Both services are starting in dedicated terminal windows!
echo - Backend API:  http://127.0.0.1:8000/docs
echo - Frontend UI:  http://localhost:5173
echo ========================================================

