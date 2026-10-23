@echo off
title AirSense India - College Project (Preethish)
cd /d "%~dp0"
echo ========================================================
echo AirSense India - AQI and Pollution Index Website
echo ========================================================
echo.
echo [1/2] Checking and installing dependencies...
pip install -r requirements.txt
echo.
echo [2/2] Starting server at http://localhost:8000 ...
echo Press Ctrl+C in this window to stop the server.
echo.
start http://localhost:8000
python app.py
pause
