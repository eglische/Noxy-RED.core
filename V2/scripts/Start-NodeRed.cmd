@echo off
setlocal
set "BASE_DIR=%~dp0"
set "RUNTIME_DIR=%BASE_DIR%runtime\node-v20.20.2-win-x64"
set "APP_DIR=%BASE_DIR%app"
set "USER_DIR=%BASE_DIR%user"
set "PORT=1880"

if not exist "%RUNTIME_DIR%\node.exe" (
  echo Node.js runtime not found in "%RUNTIME_DIR%".
  pause
  exit /b 1
)

if not exist "%APP_DIR%\node_modules\node-red\red.js" (
  echo Node-RED was not installed correctly in "%APP_DIR%".
  pause
  exit /b 1
)

start "Node-RED" "%RUNTIME_DIR%\node.exe" "%APP_DIR%\node_modules\node-red\red.js" --userDir "%USER_DIR%" --port %PORT%
exit /b 0
