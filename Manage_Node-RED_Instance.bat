@echo off
setlocal ENABLEDELAYEDEXPANSION

:: Define paths
set "APPSETTINGS_PATH=bin\ProviderAPP\appsettings.json"
set "INSTANCE_DIR=instance"
set "DATESTAMP=%DATE:~0,10%"
set "TIMESTAMP=%TIME:~0,5%"
set "DATESTAMP=%DATESTAMP:/=-%"
set "TIMESTAMP=%TIMESTAMP::=-%"
set "DATETIME=%DATESTAMP%_%TIMESTAMP%"
set "ZIP_TOOL=%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe"

:: Check if settings file exists
if not exist "%APPSETTINGS_PATH%" (
    echo ERROR: Configuration file not found at "%APPSETTINGS_PATH%"
    pause
    exit /b
)

:: Detect Noxy-RED.coreMethod from appsettings.json
for /f "usebackq tokens=*" %%a in (`powershell -NoProfile -Command ^
    "(Get-Content '%APPSETTINGS_PATH%' -Raw | ConvertFrom-Json).'Voxta.Provider'.'Noxy-RED.coreMethod'"`) do (
    set "COREMETHOD=%%a"
)

:: Decide node-red path
if /i "%COREMETHOD%"=="local" (
    set "NR_FOLDER=%USERPROFILE%\.node-red"
) else (
    echo.
    echo WARNING: Remote coreMethod detected.
    echo This tool may not work unless run on the same computer as Node-RED.
    set /p "NR_FOLDER=Please enter the absolute path to your Node-RED installation: "
)

:: Validate Node-RED folder
if not exist "%NR_FOLDER%" (
    echo ERROR: Node-RED folder not found at "%NR_FOLDER%"
    pause
    exit /b
)

:: Main menu loop
:MENU
echo.
echo ===============================
echo Node-RED Configuration Manager
echo ===============================
echo.
echo Current Mode: %COREMETHOD%
echo Node-RED Folder: %NR_FOLDER%
echo.
echo (S) Save current configuration
echo (L) Load existing configuration
echo (Q) Quit
echo.

set /p "choice=Enter your choice (S/L/Q): "
if /i "%choice%"=="S" goto :SAVE
if /i "%choice%"=="L" goto :LOAD
if /i "%choice%"=="Q" exit /b

echo Invalid choice.
goto :MENU

:: -------------------------------
:SAVE
echo.
set /p "FILENAME=Enter a name for the configuration ZIP file (no spaces): "
if "%FILENAME%"=="" (
    echo Invalid name.
    goto :MENU
)

:: Ensure instance directory exists
if not exist "%INSTANCE_DIR%" (
    mkdir "%INSTANCE_DIR%"
)

set "ZIPNAME=timestamp_%DATESTAMP%_%TIMESTAMP%_%FILENAME%.zip"
set "DESTZIP=%INSTANCE_DIR%\%ZIPNAME%"

echo Creating zip file: %DESTZIP%
%ZIP_TOOL% -Command "Compress-Archive -Path '%NR_FOLDER%\flows*.json','%NR_FOLDER%\*.txt' -DestinationPath '%DESTZIP%' -Force"

if exist "%DESTZIP%" (
    echo Configuration saved successfully!
) else (
    echo ERROR: Failed to create zip.
)
pause
goto :MENU

:: -------------------------------
:LOAD
echo.
if not exist "%INSTANCE_DIR%" (
    echo WARNING: No instance folder found.
    pause
    goto :MENU
)

setlocal EnableDelayedExpansion
set /a count=0
set "fileList="

:: Scan for zip files and list them
for /f "delims=" %%f in ('dir /b /a-d /o-d "%INSTANCE_DIR%\timestamp_*.zip"') do (
    set /a count+=1
    set "file[!count!]=%%f"
    set "displayName=%%~nf"
    set "displayName=!displayName:timestamp_=!"
    echo [!count!] !displayName!
)

if !count! EQU 0 (
    echo WARNING: No backup zip files found in %INSTANCE_DIR%
    endlocal
    pause
    goto :MENU
)

echo.
set /p "pick=Enter number to load or B to go back: "
if /i "%pick%"=="B" (
    endlocal
    goto :MENU
)

:: Validate number
set /a choiceNum=%pick% 2>NUL
if "!file[%choiceNum%]!"=="" (
    echo Invalid selection.
    endlocal
    pause
    goto :LOAD
)

:: Extract the selected zip
set "chosenFile=!file[%choiceNum%]!"
echo Extracting !chosenFile! to %NR_FOLDER%
%ZIP_TOOL% -Command "Expand-Archive -Path '%INSTANCE_DIR%\!chosenFile!' -DestinationPath '%NR_FOLDER%' -Force"

echo Extraction complete.
endlocal
pause
goto :MENU
