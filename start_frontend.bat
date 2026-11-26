@echo off
title VoltPulse EV Charging Network - Frontend Server
cd /d "%~dp0\frontend"

echo ===================================================
echo   VoltPulse EV Charging Network Management System
echo ===================================================
echo.
echo Starting development server...
echo URL: http://localhost:5173
echo.

start "" "http://localhost:5173"
call npm run dev

pause
