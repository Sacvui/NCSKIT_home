# Vercel Deploy Script for NCSKIT
# This script helps automate the deployment process

Write-Host "`n🚀 NCSKIT - Vercel Deployment Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found" -ForegroundColor Red
    Write-Host "`nInstalling Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed" -ForegroundColor Green
} else {
    Write-Host "✅ Vercel CLI found" -ForegroundColor Green
}

# Check if logged in
Write-Host "`n🔐 Checking Vercel login status..." -ForegroundColor Yellow
$loginCheck = vercel whoami 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Not logged in. Please login:" -ForegroundColor Yellow
    vercel login
} else {
    Write-Host "✅ Logged in as: $loginCheck" -ForegroundColor Green
}

# Check environment variables
Write-Host "`n📝 Checking environment variables..." -ForegroundColor Yellow

if (-not (Test-Path ".env.local")) {
    Write-Host "❌ .env.local not found" -ForegroundColor Red
    Write-Host "Please create .env.local with required variables:" -ForegroundColor Yellow
    Write-Host "  - POSTGRES_URL" -ForegroundColor White
    Write-Host "  - NEXTAUTH_SECRET" -ForegroundColor White
    Write-Host "  - NEXTAUTH_URL" -ForegroundColor White
    exit 1
}

Write-Host "✅ .env.local found" -ForegroundColor Green

# Ask for deployment type
Write-Host "`n📦 Deployment Options:" -ForegroundColor Cyan
Write-Host "1. Preview deployment (test)" -ForegroundColor White
Write-Host "2. Production deployment" -ForegroundColor White
$deployType = Read-Host "`nSelect option (1 or 2)"

if ($deployType -eq "1") {
    Write-Host "`n🚀 Deploying to preview..." -ForegroundColor Yellow
    vercel
} elseif ($deployType -eq "2") {
    Write-Host "`n🚀 Deploying to production..." -ForegroundColor Yellow
    Write-Host "⚠️  Make sure you've:" -ForegroundColor Yellow
    Write-Host "  - Set all environment variables in Vercel Dashboard" -ForegroundColor White
    Write-Host "  - Run database migration" -ForegroundColor White
    Write-Host "  - Tested preview deployment" -ForegroundColor White
    $confirm = Read-Host "`nContinue with production deployment? (y/N)"
    
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        vercel --prod
    } else {
        Write-Host "Deployment cancelled" -ForegroundColor Yellow
        exit 0
    }
} else {
    Write-Host "Invalid option" -ForegroundColor Red
    exit 1
}

Write-Host "`n✨ Deployment process completed!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Check deployment status in Vercel Dashboard" -ForegroundColor White
Write-Host "2. Test authentication on deployed site" -ForegroundColor White
Write-Host "3. Update NEXTAUTH_URL if using custom domain" -ForegroundColor White
Write-Host "`n"

