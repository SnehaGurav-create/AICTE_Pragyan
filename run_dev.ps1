Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting PRAGYAN-AICTE Unified System (PowerShell)    " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan

$backendDir = Join-Path $PSScriptRoot "Backend"
$frontendDir = Join-Path $PSScriptRoot "Frontend"

Write-Host "Starting FastAPI Backend on http://127.0.0.1:8000 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendDir'; python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"

Write-Host "Starting React Vite Frontend on http://localhost:5173 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendDir'; npm run dev"

Write-Host "`nBoth services started in dedicated shells!" -ForegroundColor Green
Write-Host "Backend API docs: http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host "Frontend UI:      http://localhost:5173" -ForegroundColor White

