@echo off
setlocal

:: Get the directory of this script (its own path)
set "script_dir=%~dp0"

:: Define paths to executables
set "noxy_path=%script_dir%bin\Standalone\keyemulator.exe"
set "mfp_path=%script_dir%bin\MFP\MultiFunPlayer.exe"

:: Define paths to Mosquitto and Node-RED (adjust as needed)
set "mosquitto_path=C:\Program Files\Mosquitto\mosquitto.exe"
set "node_red_cmd=node-red"

:: Start Standalone Version (Noxy-RED Keyamulator) in its own folder
if exist "%noxy_path%" (
    pushd "%~dp0bin\Standalone"
    start "" "%noxy_path%"
    popd
) else (
    echo ERROR: Noxy-RED Standalone Keyamulator not found at "%noxy_path%"
    pause
)


:: Start MultiFunPlayer if it exists
if exist "%mfp_path%" (
    start "" "%mfp_path%"
)

:: Start Mosquitto broker in a minimized command window
if exist "%mosquitto_path%" (
    start /min cmd /k "%mosquitto_path%"
) else (
    echo WARNING: Mosquitto broker not found at %mosquitto_path%
)

:: Start Node-RED in a minimized command window
start /min cmd /k "%node_red_cmd%"

:: Terminate this script immediately after launching applications
pause
