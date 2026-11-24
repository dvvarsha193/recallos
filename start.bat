@echo off
echo Starting RecallOS Development Server...
cd /d "%~dp0"
call npm run dev
pause
