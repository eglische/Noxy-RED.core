@echo off
setlocal

:: Get the directory of this script (its own path)
set "script_dir=%~dp0"

:: Define paths to executables
set "voxta_path=%script_dir%bin\ProviderAPP\VoxtaMQTTV2.exe"
set "mfp_path=%script_dir%bin\MFP\MultiFunPlayer.exe"

:: Start VoxtaMQTTV2 (Noxy-RED core) normally
if exist "%voxta_path%" (
    start "" "%voxta_path%"
) else (
    echo ERROR: VoxtaMQTTV2.exe not found at %voxta_path%
    pause
)

:: Start MultiFunPlayer if it exists
if exist "%mfp_path%" (
    start "" "%mfp_path%"
)

:: Terminate this script immediately after launching applications
exit
