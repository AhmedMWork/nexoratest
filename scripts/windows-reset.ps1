# NEXORA V2 Windows clean install helper
# Run from the project root using PowerShell.

$ErrorActionPreference = "Stop"

Write-Host "NEXORA V2 — resetting local install" -ForegroundColor Cyan
npm config set registry https://registry.npmjs.org/

if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }
if (Test-Path package-lock.json) { Remove-Item -Force package-lock.json }
if (Test-Path pnpm-lock.yaml) { Remove-Item -Force pnpm-lock.yaml }
if (Test-Path pnpm-workspace.yaml) { Remove-Item -Force pnpm-workspace.yaml }

if (Test-Path functions\node_modules) { Remove-Item -Recurse -Force functions\node_modules }
if (Test-Path functions\package-lock.json) { Remove-Item -Force functions\package-lock.json }

Write-Host "Installing storefront dependencies..." -ForegroundColor Cyan
npm install
npm run build

Write-Host "Installing Firebase Functions dependencies..." -ForegroundColor Cyan
Push-Location functions
npm install
npm run build
Pop-Location

Write-Host "NEXORA V2 install verified." -ForegroundColor Green
