@echo off
setlocal enabledelayedexpansion

:: Ensure script runs in its own directory (fixes Admin mode issue)
cd /d "%~dp0"

:: Check for admin privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo.
    echo **************************************
    echo  ERROR: This script must be run as Administrator!
    echo  Please right-click the script and choose 'Run as Administrator'.
    echo **************************************
    echo.
    pause
    exit /b
)

:: Set timestamp for zip file name
for /f "tokens=2 delims==" %%I in ('"wmic os get localdatetime /value"') do set "datetime=%%I"
set "timestamp=%datetime:~0,8%_%datetime:~8,6%"

:: Define ports to check
set "ports=1880 1883"

:: Define log file name in script's directory
set "logfile=%CD%\log.txt"

:: Create or clear log file
echo Log started on %DATE% %TIME% > "%logfile%"
echo Scanning for processes using ports 1880 and 1883... >> "%logfile%"

:: Loop through the defined ports
for %%P in (%ports%) do (
    echo Checking port %%P...
    echo. >> "%logfile%"
    echo === Netstat results for port %%P === >> "%logfile%"
    echo. >> "%logfile%"

    :: Log full netstat data for the port
    netstat -ano | findstr /C:":%%P" >> "%logfile%"

    :: Extract PID of listening process and find process name
    for /f "tokens=5" %%A in ('netstat -ano ^| findstr /C:":%%P" ^| findstr /V "TIME_WAIT"') do (
        set "PID=%%A"
        echo. >> "%logfile%"
        echo === Process Details for PID !PID! === >> "%logfile%"
        echo. >> "%logfile%"

        for /f "tokens=*" %%B in ('tasklist /FI "PID eq !PID!" ^| findstr /V "Image Name"') do (
            echo Port %%P - PID !PID!: %%B >> "%logfile%"
        )
    )
)

:: Define temp log file path (user temp folder)
set "temp_log=%temp%\dependencies_install.log"

:: Define zip file name in script's directory
set "zipfile=%CD%\report%timestamp%.zip"

:: Check if dependencies_install.log exists and create a zip file
echo Creating zip file "%zipfile%"...
if exist "%temp_log%" (
    echo Including "%temp_log%" in zip...
    powershell -Command "Compress-Archive -Path '%logfile%', '%temp_log%' -DestinationPath '%zipfile%' -Force"
) else (
    echo "%temp_log%" not found. Zipping only log.txt...
    powershell -Command "Compress-Archive -Path '%logfile%' -DestinationPath '%zipfile%' -Force"
)

echo Zip archive created: %zipfile%
echo Scan completed. Check "%zipfile%" for details.
pause
exit /b
