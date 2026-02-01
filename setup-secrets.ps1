# setup-secrets.ps1
$ErrorActionPreference = "Stop"

$SECRETS = @("DATABASE_URL", "DIRECT_URL", "JWT_SECRET", "JWT_REFRESH_SECRET", "REDIS_URL", "RESEND_API_KEY", "ADMIN_PASSWORD")
$EnvPath = Join-Path $PSScriptRoot "backend/.env"

if (!(Test-Path $EnvPath)) {
    Write-Host "Error: .env not found at $EnvPath" -ForegroundColor Red
    exit 1
}

if (!(Get-Command "gh" -ErrorAction SilentlyContinue)) {
    Write-Host "Error: GitHub CLI (gh) not installed." -ForegroundColor Red
    exit 1
}

Write-Host "Reading $EnvPath..." -ForegroundColor Cyan
$Lines = Get-Content $EnvPath

foreach ($Line in $Lines) {
    if ($Line -match "^\s*#" -or $Line -match "^\s*$") { continue }
    
    if ($Line -match "^(?<Key>[^=]+)=(?<Value>.*)$") {
        $Key = $Matches.Key.Trim()
        $Value = $Matches.Value.Trim()
        
        # Remove usage of quotes around value
        $Value = $Value -replace '^"|"$', '' -replace "^'|'$", ''

        if ($SECRETS -contains $Key) {
            Write-Host "Setting secret: $Key" -ForegroundColor Yellow
            # Pipe value to standard input of gh to avoid quoting issues
            $Value | gh secret set $Key
            
            if ($LASTEXITCODE -eq 0) {
                 Write-Host "   OK" -ForegroundColor Green
            } else {
                 Write-Host "   FAILED" -ForegroundColor Red
            }
        }
    }
}
Write-Host "Done." -ForegroundColor Cyan
