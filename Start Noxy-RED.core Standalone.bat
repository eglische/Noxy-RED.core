@echo off

:: Set working directory to the script location
cd /d "%~dp0"

:: Start Node-RED with the specified user and system folder
start "Node-RED" /D "nodered" "nodered\node_modules\.bin\node-red.bat" --userDir "nodered"

:: Wait a few seconds to ensure Node-RED starts before launching the app
timeout /t 5 /nobreak >nul

:: Start the application
start "Keyemulator" "binary\keystrokes\keyemulator.exe"