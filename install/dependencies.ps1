# PowerShell Script to Install Dependencies for Your Project
# Filename: dependencies.ps1
Start-Transcript -Path "$env:TEMP\dependencies_install.log" -Append
# Check if the script is running as Administrator
function Test-Admin {
    $currentUser = [Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()
    return $currentUser.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Relaunch with Admin Rights if necessary
if (-not (Test-Admin)) {
    Write-Host "Restarting script with Administrator privileges..." -ForegroundColor Yellow

    # Start a new elevated PowerShell session
    $scriptPath = $MyInvocation.MyCommand.Definition
    Start-Process powershell.exe -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`"" -Verb RunAs
    Exit
}

Write-Host "Running with Administrator privileges!" -ForegroundColor Green

# Ensure execution policy allows script execution
Set-ExecutionPolicy Bypass -Scope Process -Force

# Ensure execution policy allows script execution
Set-ExecutionPolicy Bypass -Scope Process -Force

# Suppress Errors and Warnings
$ErrorActionPreference = "Stop"

# Detect PowerShell Version
$PowerShellVersion = $PSVersionTable.PSVersion.Major

# Function to Install Node.js (LTS) with JSON discovery
function Install-NodeJS {
    Write-Host "Installing Node.js LTS..."

    # Get latest LTS version JSON from Node.js API
    $nodeData = Invoke-RestMethod -Uri "https://nodejs.org/dist/index.json" -UseBasicParsing

    # Find latest LTS version
    $ltsVersion = ($nodeData | Where-Object { $_.lts -ne $null })[0].version
    $nodeInstaller = "https://nodejs.org/dist/$ltsVersion/node-$ltsVersion-x64.msi"

    # Download Node.js MSI installer
    $msiPath = "$env:TEMP\nodejs.msi"
    
    if ($PowerShellVersion -ge 7) {
        Invoke-WebRequest -Uri $nodeInstaller -OutFile $msiPath -SkipCertificateCheck
    } else {
        [System.Net.ServicePointManager]::ServerCertificateValidationCallback = { $true }
        Invoke-WebRequest -Uri $nodeInstaller -OutFile $msiPath -UseBasicParsing
    }

    # Install silently
    Start-Process msiexec.exe -ArgumentList "/i $msiPath /quiet /norestart /L*v `"$env:TEMP\nodejs_install.log`"" -Wait -NoNewWindow

    # Reload PATH for current session
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::Machine)

    # Verify installation using `where.exe`
    $nodeExists = where.exe node 2>$null

    if ($nodeExists) {
        Write-Host "Node.js installed successfully!"
    } else {
        Write-Host "Node.js installation failed or is not detected in PATH." -ForegroundColor Red
        Write-Host "You may need to restart your system." -ForegroundColor Yellow
        Exit 1
    }
}

# Kill any existing Mosquitto installer processes (if they exist)
Get-Process | Where-Object { $_.ProcessName -like "mosquitto-installer*" } | Stop-Process -Force -ErrorAction SilentlyContinue


# Function to Install Mosquitto (without Service)
function Install-Mosquitto {
    Write-Host "Installing Mosquitto broker..."

    # Ensure TLS 1.2 is used for secure web requests (Fix for PowerShell 5.x)
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

    # Define correct installer path
    $mosquittoInstaller = "https://mosquitto.org/files/binary/win64/mosquitto-2.0.20-install-windows-x64.exe"
    $mosquittoExePath = "$env:TEMP\mosquitto-installer.exe"

    # Log File Path
    $installLog = "$env:TEMP\mosquitto_install.log"

    # Try downloading Mosquitto installer using BitsTransfer (more reliable)
    try {
        Write-Host "Downloading Mosquitto installer..."
        Import-Module BitsTransfer
        Start-BitsTransfer -Source $mosquittoInstaller -Destination $mosquittoExePath
        Write-Host "Mosquitto installer downloaded successfully: $mosquittoExePath"

        # Start Mosquitto installation and capture process
        Write-Host "Starting Mosquitto installation (this may take a while)..."
        $process = Start-Process -FilePath $mosquittoExePath -ArgumentList "/S" -PassThru -NoNewWindow

        # Wait for Mosquitto installer process to exit
        Write-Host "Waiting for Mosquitto installer to finish..."
        $process.WaitForExit()

        # Manual wait loop (to ensure installation is complete)
        $installTimeout = 30  # Maximum wait time in seconds
        $elapsedTime = 0
        while (!(Test-Path "C:\Program Files\mosquitto\mosquitto.exe") -and ($elapsedTime -lt $installTimeout)) {
            Start-Sleep -Seconds 2
            $elapsedTime += 2
            Write-Host "Waiting for Mosquitto installation to complete ($elapsedTime/$installTimeout seconds)..."
        }

        # Final verification
        if (Test-Path "C:\Program Files\mosquitto\mosquitto.exe") {
            Write-Host "Mosquitto installed successfully!"
        } else {
            throw "Mosquitto installation took too long or failed. Check manually."
        }
    }
    catch {
        Write-Host "`n[WARNING] Failed to install Mosquitto automatically." -ForegroundColor Yellow
        Write-Host "Error: $_"  # Print error message for debugging

        Write-Host "`nPlease install Mosquitto manually by visiting:`n" -ForegroundColor Cyan
        Write-Host "https://mosquitto.org/download/" -ForegroundColor Blue
        Write-Host "`nOnce installed, press [Enter] to continue the script..." -ForegroundColor Yellow
        Read-Host
    }
}

# Function to Install Node-RED and Required Nodes in the correct user profile
function Install-NodeRed {
    Write-Host "Installing Node-RED locally for the user..."

    # Ensure the user's npm path exists
    $userNpmPath = "$env:APPDATA\npm"
    if (!(Test-Path $userNpmPath)) {
        New-Item -ItemType Directory -Path $userNpmPath -Force | Out-Null
    }

    # Install Node-RED locally (not globally!)
    npm install --prefix "$userNpmPath" node-red

    # Ensure PATH is updated so Node-RED is found
    $env:Path = "$userNpmPath;$env:Path"
    [System.Environment]::SetEnvironmentVariable("Path", "$userNpmPath;$env:Path", [System.EnvironmentVariableTarget]::User)

    # Get the actual logged-in user (not the admin account)
    $userProfile = [System.Environment]::GetFolderPath("UserProfile")
    $nodeRedUserDir = "$userProfile\.node-red"

    # Ensure Node-RED user directory exists
    if (!(Test-Path $nodeRedUserDir)) {
        Write-Host "Creating Node-RED user directory at $nodeRedUserDir..."
        New-Item -ItemType Directory -Path $nodeRedUserDir -Force | Out-Null
    }

    # Install necessary modules inside .node-red (DO NOT use -g)
    Write-Host "Installing Node-RED modules..."
    Push-Location $nodeRedUserDir
    npm install node-red-contrib-noxy node-red-contrib-tapo-new-api dashboard-evi
    Pop-Location

    # Verify installation in the correct directory
    Write-Host "Verifying Node-RED node installation..."
    Push-Location $nodeRedUserDir
    $installedNodes = npm list --depth=0 2>&1
    Pop-Location

    Write-Host "Installed Node-RED nodes:"
    Write-Host $installedNodes

    if ($installedNodes -match "node-red-contrib-noxy" -and $installedNodes -match "node-red-contrib-tapo-new-api" -and $installedNodes -match "dashboard-evi") {
        Write-Host "Node-RED modules installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Node-RED module installation verification failed!" -ForegroundColor Red
        Write-Host "Check if the packages were installed in the correct user directory."
        Exit 1
    }

    Write-Host "Node-RED installation complete!"
}


function Import-NodeRedConfig {
    Write-Host "Importing Node-RED configuration from GitHub..."

    # Ensure TLS 1.2 is used for secure web requests
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

    # Get the current user's home directory
    $userProfile = [System.Environment]::GetFolderPath("UserProfile")
    $nodeRedUserDir = "$userProfile\.node-red"
    $tempDir = "$env:TEMP\nodered-github"
    $repoZip = "$tempDir\nodered.zip"
    $repoExtractPath = "$tempDir\Noxy-RED.core-main"
    $repoUrl = "https://github.com/eglische/Noxy-RED.core/archive/refs/heads/main.zip"

    # Ensure temp directory exists
    if (!(Test-Path $tempDir)) { New-Item -ItemType Directory -Path $tempDir -Force | Out-Null }

    try {
        Write-Host "Downloading Node-RED configuration from GitHub using BitsTransfer..."
        Import-Module BitsTransfer -ErrorAction Stop
        Start-BitsTransfer -Source $repoUrl -Destination $repoZip
        Write-Host "Download complete. Checking file integrity..."

        # Check if ZIP exists and is valid (avoid corrupt downloads)
        if (!(Test-Path $repoZip)) {
            throw "Download failed! File not found."
        }
        if ((Get-Item $repoZip).Length -lt 10000) {  # Check for incomplete downloads
            throw "Download failed! File size too small, possibly incomplete."
        }

        Write-Host "Extracting files..."
        Remove-Item -Path $repoExtractPath -Recurse -Force -ErrorAction SilentlyContinue
        Expand-Archive -Path $repoZip -DestinationPath $tempDir -Force

        # Adjusted path for `nodered` folder inside extracted directory
        $extractedFolder = "$repoExtractPath\nodered"

        if (!(Test-Path $extractedFolder)) {
            throw "Extraction failed! Could not find 'nodered' folder inside the extracted repository."
        }

        # Ensure .node-red is a directory, not a file
        if (Test-Path $nodeRedUserDir) {
            if (!(Test-Path $nodeRedUserDir -PathType Container)) {
                Write-Host "A file named '.node-red' exists! Removing it to create the directory..." -ForegroundColor Yellow
                Remove-Item $nodeRedUserDir -Force
            }
        }

        # Ensure .node-red directory exists
        if (!(Test-Path $nodeRedUserDir)) {
            New-Item -ItemType Directory -Path $nodeRedUserDir -Force | Out-Null
        }

        Write-Host "Copying configuration files to $nodeRedUserDir ..."
        Copy-Item -Path "$extractedFolder\*" -Destination $nodeRedUserDir -Recurse -Force
        Write-Host "Node-RED configuration successfully imported!" -ForegroundColor Green
    }
    catch {
        Write-Host "`n[ERROR] Failed to import Node-RED configuration from GitHub!" -ForegroundColor Red
        Write-Host "Error: $_"
        Write-Host "`nPlease manually download and extract from: $repoUrl"
    }
    finally {
        # Cleanup temporary files
        Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}



# Start Installation Process
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::Machine)
Install-NodeJS
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::Machine)
Install-Mosquitto
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::Machine)
Install-NodeRed
Write-Host "Installation Complete! You can now start using Node-RED and Mosquitto." -ForegroundColor Cyan
Stop-Transcript