@echo off
setlocal
set "BASE_DIR=%~dp0"
if not exist "%BASE_DIR%MultiFunPlayer.exe" (
  echo MultiFunPlayer.exe not found in "%BASE_DIR%".
  pause
  exit /b 1
)

start "MultiFunPlayer" "%BASE_DIR%MultiFunPlayer.exe"
exit /b 0
