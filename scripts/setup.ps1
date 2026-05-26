# Windows 入口 → 跨平台安装逻辑见 scripts/setup.js
$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")
node scripts/setup.js @args
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
