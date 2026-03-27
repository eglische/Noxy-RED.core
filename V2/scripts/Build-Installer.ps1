$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$iss = Join-Path $root 'installer\NoxyNodeRedBundle.iss'

$iscc = Get-Command iscc.exe -ErrorAction SilentlyContinue
if (-not $iscc) {
    throw 'Inno Setup compiler (iscc.exe) is not installed or not on PATH.'
}

& $iscc.Source $iss
