# Auto-sync script for Windows
param(
    [string]$CommitMessage = "Auto-sync: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
)

Write-Host "🔄 Starting auto-sync process..." -ForegroundColor Cyan

# Function to check if git command succeeded
function Test-GitCommand {
    param($Command)
    
    try {
        Invoke-Expression $Command
        return $LASTEXITCODE -eq 0
    }
    catch {
        return $false
    }
}

# Add and commit changes
Write-Host "📝 Staging changes..." -ForegroundColor Yellow
git add .

if (git diff --staged --quiet) {
    Write-Host "ℹ️  No changes to commit" -ForegroundColor Blue
} else {
    Write-Host "💾 Committing changes..." -ForegroundColor Yellow
    git commit -m $CommitMessage
}

# Setup target remote if not exists
if (-not (git remote | Select-String "ncsstat_kiro")) {
    Write-Host "➕ Adding ncsstat_kiro remote..." -ForegroundColor Green
    git remote add ncsstat_kiro https://github.com/hailp1/ncsstat_kiro.git
}

# Push to target repository
Write-Host "📤 Pushing to ncsstat_kiro..." -ForegroundColor Yellow

if (Test-GitCommand "git push ncsstat_kiro main") {
    Write-Host "✅ Successfully synced to ncsstat_kiro!" -ForegroundColor Green
    Write-Host "🔗 https://github.com/hailp1/ncsstat_kiro" -ForegroundColor Cyan
} else {
    Write-Host "❌ Sync failed - authentication required" -ForegroundColor Red
    Write-Host "💡 Please run manually: git push ncsstat_kiro main" -ForegroundColor Yellow
    
    # Try to open GitHub for authentication
    $response = Read-Host "🔐 Open GitHub for authentication? (y/n)"
    if ($response -eq 'y') {
        Start-Process "https://github.com/settings/tokens"
        Write-Host "📋 Create a Personal Access Token with 'repo' permissions" -ForegroundColor Cyan
        Write-Host "🔑 Use the token as password when prompted" -ForegroundColor Cyan
    }
}

Write-Host "🎯 Auto-sync process completed" -ForegroundColor Magenta