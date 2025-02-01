@echo off
setlocal

:: Define log file location outside the temp directory
set "LOGFILE=%TEMP%\dependencies_install.log"

:: Append update header to log
echo. >> "%LOGFILE%"
echo -----UPDATE----- >> "%LOGFILE%"
echo %DATE% %TIME% >> "%LOGFILE%"
echo. >> "%LOGFILE%"

:: Check if script is running as Administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Requesting administrative privileges... >> "%LOGFILE%"
    powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "Start-Process cmd -ArgumentList '/c %~s0' -Verb RunAs"
    exit /b
)

:: Set script directory
set "script_dir=%~dp0"

:: Define temporary paths
set "TEMP_DIR=%TEMP%\Noxy-RED_Update"
set "ZIP_PATH=%TEMP_DIR%\Noxy-RED-core.zip"
set "EXTRACT_PATH=%TEMP_DIR%\Noxy-RED.core-main"
set "SOURCE_PATH=%EXTRACT_PATH%\bin\ProviderAPP"
set "DESTINATION_PATH=%script_dir%bin\ProviderAPP"

:: Log path information
echo TEMP_DIR: %TEMP_DIR% >> "%LOGFILE%"
echo ZIP_PATH: %ZIP_PATH% >> "%LOGFILE%"
echo EXTRACT_PATH: %EXTRACT_PATH% >> "%LOGFILE%"
echo SOURCE_PATH: %SOURCE_PATH% >> "%LOGFILE%"
echo DESTINATION_PATH: %DESTINATION_PATH% >> "%LOGFILE%"
echo. >> "%LOGFILE%"

:: Create temp directory if it does not exist
if not exist "%TEMP_DIR%" mkdir "%TEMP_DIR%" >> "%LOGFILE%"

:: Download latest Noxy-RED core from GitHub
echo Downloading Noxy-RED update... >> "%LOGFILE%"
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
"Invoke-WebRequest -Uri 'https://github.com/eglische/Noxy-RED.core/archive/refs/heads/main.zip' -OutFile '%ZIP_PATH%' -UseBasicParsing" >> "%LOGFILE%" 2>&1

if %errorLevel% neq 0 (
    echo ERROR: Failed to download the update. Check internet connection. >> "%LOGFILE%"
    exit /b 1
)

:: Extract downloaded ZIP
echo Extracting update files... >> "%LOGFILE%"
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
"Expand-Archive -Path '%ZIP_PATH%' -DestinationPath '%TEMP_DIR%' -Force" >> "%LOGFILE%" 2>&1

if %errorLevel% neq 0 (
    echo ERROR: Failed to extract the update files. >> "%LOGFILE%"
    exit /b 1
)

:: Log extracted directory structure
echo Extracted folder structure: >> "%LOGFILE%"
dir /s "%EXTRACT_PATH%" >> "%LOGFILE%" 2>&1

:: Check if extracted path exists
if not exist "%SOURCE_PATH%" (
    echo ERROR: Update folder structure is incorrect! >> "%LOGFILE%"
    echo ERROR: Expected path missing: %SOURCE_PATH% >> "%LOGFILE%"
    exit /b 1
)

:: Copy extracted files to the installation directory
echo Updating files in %DESTINATION_PATH%... >> "%LOGFILE%"
xcopy "%SOURCE_PATH%\*" "%DESTINATION_PATH%\" /E /H /C /I /Y >> "%LOGFILE%" 2>&1

if %errorLevel% neq 0 (
    echo ERROR: Failed to copy update files. >> "%LOGFILE%"
    exit /b 1
)

:: Move log file to a safe location before cleanup
copy "%LOGFILE%" "%TEMP%\dependencies_install_backup.log" >nul 2>&1

:: Cleanup temp files
echo Cleaning up temporary files... >> "%LOGFILE%"
rmdir /S /Q "%TEMP_DIR%" >> "%LOGFILE%" 2>&1

:: Ensure log file is still available
copy "%TEMP%\dependencies_install_backup.log" "%LOGFILE%" >nul 2>&1
del "%TEMP%\dependencies_install_backup.log" >nul 2>&1

echo Update complete! >> "%LOGFILE%"
exit /b 0
