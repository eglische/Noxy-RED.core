@echo off
setlocal

:: Check for .NET 8 installation (matches any 8.x.x version)
dotnet --list-runtimes | findstr /R "^Microsoft.NETCore.App 8\." >nul
if %errorlevel% neq 0 (
    echo.
    echo .NET 8 is not installed or not found on this system.
    echo Please install it from:
    echo https://dotnet.microsoft.com/en-us/download/dotnet/8.0
    echo.
    pause
    exit /b
)

:: Set the directory where the batch file is located (relative path)
set script_dir=%~dp0

echo "+--------------------------------------+"
echo "^  <<<<==== Noxy-RED.core ====>>>>     ^"
echo "+--------------------------------------+"

:: Ask how the user wants to install Noxy-RED
echo.
echo How do you want to install Noxy-RED.core?
echo 1) Local - Use Noxy-RED with Voxta on your Computer (Standard)
echo 2) External - Integrate Mosquitto and Node-RED as a backend server (Advanced)
set /p choice="Enter 1 for Local, 2 for External: "

if "%choice%"=="1" (
    echo Setting Noxy-RED to Local mode...
    
    powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "(Get-Content '%script_dir%bin\ProviderAPP\appsettings.json') -replace '\"Noxy-RED.coreMethod\": *\"external\"', '\"Noxy-RED.coreMethod\": \"local\"' | Set-Content '%script_dir%bin\ProviderAPP\appsettings.json'"

    echo Noxy-RED is now set to Local mode.
)

if "%choice%"=="2" (
    echo Modifying settings for External installation...
    
    powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "(Get-Content '%script_dir%bin\ProviderAPP\appsettings.json') -replace '\"Noxy-RED.coreMethod\": *\"local\"', '\"Noxy-RED.coreMethod\": \"external\"' | Set-Content '%script_dir%bin\ProviderAPP\appsettings.json'"

    echo Changes saved. Please import the Node-RED Flows and install the Node dependencies according to the instructions on GitHub.
    pause
)

:: Ask if the user wants to create a shortcut for Noxy-RED
echo.
echo Do you want to create a shortcut for Noxy-RED on the Desktop and Start Menu?
call :ask_shortcut
if "%result%"=="y" (
    powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$WshShell = New-Object -ComObject WScript.Shell; $DesktopPath = [System.IO.Path]::Combine([System.Environment]::GetFolderPath('Desktop'), 'Noxy-RED.lnk'); $Shortcut = $WshShell.CreateShortcut($DesktopPath); $Shortcut.TargetPath = '%script_dir%start_Noxy-RED.bat'; $Shortcut.IconLocation = '%script_dir%icon\\noxyred.ico'; $Shortcut.Save()"
    echo Desktop shortcut for Noxy-RED created.

    if "%choice%"=="2" (
        powershell -NoProfile -ExecutionPolicy Bypass -Command ^
        "$WshShell = New-Object -ComObject WScript.Shell; $StartMenuPath = [System.IO.Path]::Combine($env:APPDATA, 'Microsoft\\Windows\\Start Menu\\Programs\\Noxy-RED.lnk'); $Shortcut = $WshShell.CreateShortcut($StartMenuPath); $Shortcut.TargetPath = '%script_dir%start_Noxy-RED.bat'; $Shortcut.IconLocation = '%script_dir%icon\\noxyred.ico'; $Shortcut.Save()"
        echo Start Menu shortcut for Noxy-RED created.
    )
)

:: If Local is chosen, run dependencies setup
if "%choice%"=="1" (
    echo Starting Local installation setup...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
"Start-Process -Verb RunAs -FilePath 'powershell.exe' -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File \"%script_dir%bin\\ProviderAPP\\dependencies.ps1\"' -Wait"

    echo.
    echo Installation complete. Press Enter to continue.
    pause

    :: Copy contents of "nodered" folder to user's .node-red folder
echo Copying Node-RED configuration files...

xcopy "%script_dir%nodered\*" "%USERPROFILE%\.node-red\" /E /H /C /I /Y

if %errorlevel% equ 0 (
    echo Node-RED files have been copied to %USERPROFILE%\.node-red.
) else (
    echo Failed to copy Node-RED files. Please check permissions or source folder existence.
)

pause

)

:: Ask if the user wants to install MultiFunPlayer
echo.
echo Do you want to install MultiFunPlayer to drive your Toys?
set /p mf_choice="Enter y for Yes, n for No: "

if /I "%mf_choice%"=="y" (
    echo Running MultiFunPlayer installer...

    :: Run PowerShell directly and keep the output visible
    powershell -NoProfile -ExecutionPolicy Bypass -File "%script_dir%bin\ProviderAPP\Install_MultiFunPlayer.ps1"
    
    echo MultiFunPlayer installation complete.
    pause
)

exit /b

:: Function to ask user for shortcut creation
:ask_shortcut
set /p result="Enter y for Yes, n for No: "
if /i "%result%"=="y" (
    set result=y
    goto :eof
) else if /i "%result%"=="n" (
    set result=n
    goto :eof
) else (
    echo Invalid input. Please enter y or n.
    goto ask_shortcut
)