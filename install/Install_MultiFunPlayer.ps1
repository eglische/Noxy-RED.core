# Enable strict error handling
$ErrorActionPreference = "Stop"

# Set correct installation directory (one level up from script)
$basePath = Split-Path -Path $PSScriptRoot -Parent
$installPath = "$basePath\MFP"
$zipPath = "$installPath\MultiFunPlayer.zip"
$configPath = "$installPath\MultiFunPlayer.config.json"

# Create install directory if it doesn't exist
if (!(Test-Path $installPath)) { New-Item -ItemType Directory -Path $installPath | Out-Null }

Write-Host "Fetching MultiFunPlayer releases..."

# Fetch all releases from GitHub API
$response = Invoke-RestMethod -Uri "https://api.github.com/repos/Yoooi0/MultiFunPlayer/releases"

# Initialize variables
$candidates = @()

# Iterate over releases to find all with a SelfContained asset
foreach ($release in $response) {
    foreach ($asset in $release.assets) {
        if ($asset.name -like "*SelfContained*") {
            $candidates += [PSCustomObject]@{
                ReleaseName  = $release.name
                TagName      = $release.tag_name
                AssetName    = $asset.name
                DownloadURL  = $asset.browser_download_url
                PublishedAt  = $release.published_at
            }
        }
    }
}

# Check if we found any candidates
if ($candidates.Count -eq 0) {
    Write-Host "ERROR: No MultiFunPlayer SelfContained versions found!"
    Write-Host "Press Enter to exit..."
    Read-Host | Out-Null
    exit 1
}

# Sort candidates by the latest published release (for display purposes)
$candidates = $candidates | Sort-Object -Property PublishedAt -Descending

Write-Host "Available SelfContained releases:"
$candidates | Format-Table -AutoSize

# We want to install exactly tag_name "1.30.2"
$versionToInstall = "1.30.2"

# Try to find that specific release
$selectedCandidate = $candidates | Where-Object { $_.TagName -eq $versionToInstall } | Select-Object -First 1

if (!$selectedCandidate) {
    Write-Host "`nERROR: No MultiFunPlayer SelfContained release with tag_name '$versionToInstall' found!"
    Write-Host "Press Enter to exit..."
    Read-Host | Out-Null
    exit 1
}

Write-Host "`nSelected Release: $($selectedCandidate.ReleaseName) (tag_name: $($selectedCandidate.TagName))"

# Check if the ZIP already exists
if (Test-Path $zipPath) {
    Write-Host "MultiFunPlayer.zip already exists. Skipping download."
} else {
    Write-Host "Downloading: $($selectedCandidate.AssetName)..."
    Invoke-WebRequest -Uri $selectedCandidate.DownloadURL -OutFile $zipPath
}

Write-Host "Extracting MultiFunPlayer..."
Expand-Archive -Path $zipPath -DestinationPath $installPath -Force

# Ask user for device type (Vibration or Stroke-based)
Write-Host "What Toy do you want to use?"
Write-Host "1) Vibration-based"
Write-Host "2) Stroke-based"
$toyChoice = Read-Host "Enter 1 for Vibration, 2 for Stroke"

# Determine correct configuration file URL
if ($toyChoice -eq "1") {
    $configURL = "https://raw.githubusercontent.com/eglische/Noxy-RED.core/main/mfp/vib/MultiFunPlayer.config.json"
    Write-Host "Downloading Vibration-based configuration..."
} elseif ($toyChoice -eq "2") {
    $configURL = "https://raw.githubusercontent.com/eglische/Noxy-RED.core/main/mfp/stroke/MultiFunPlayer.config.json"
    Write-Host "Downloading Stroke-based configuration..."
} else {
    Write-Host "Invalid choice. Exiting..."
    exit 1
}

# Download the correct configuration file
Invoke-WebRequest -Uri $configURL -OutFile $configPath -UseBasicParsing

Write-Host "Configuration updated successfully."

Write-Host "Creating shortcut..."
$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [System.IO.Path]::Combine([System.Environment]::GetFolderPath("Desktop"), "MultiFunPlayer.lnk")
$Shortcut = $WshShell.CreateShortcut($DesktopPath)
$Shortcut.TargetPath = "$installPath\MultiFunPlayer.exe"
$Shortcut.Save()

Write-Host "MultiFunPlayer installation and configuration complete!"
Write-Host "You can now start MultiFunPlayer manually from the shortcut."
Write-Host "Press Enter to exit..."
Read-Host | Out-Null
