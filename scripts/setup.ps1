# NCSKIT Authentication Setup Script
# This script helps set up the authentication system with Vercel Postgres

Write-Host "`n🚀 NCSKIT Authentication Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check if .env.local exists
if (Test-Path ".env.local") {
    Write-Host "`n✅ .env.local already exists" -ForegroundColor Green
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Skipping .env.local creation" -ForegroundColor Yellow
        exit 0
    }
}

# Create .env.local from .env.example
if (Test-Path ".env.example") {
    Write-Host "`n📝 Creating .env.local from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host "✅ Created .env.local" -ForegroundColor Green
    Write-Host "`n⚠️  IMPORTANT: Please edit .env.local and add your:" -ForegroundColor Yellow
    Write-Host "   - POSTGRES_URL (from Vercel Dashboard)" -ForegroundColor White
    Write-Host "   - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)" -ForegroundColor White
} else {
    Write-Host "❌ .env.example not found" -ForegroundColor Red
}

# Generate NEXTAUTH_SECRET if openssl is available
Write-Host "`n🔐 Generating NEXTAUTH_SECRET..." -ForegroundColor Yellow
try {
    $secret = & openssl rand -base64 32 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Generated secret: $secret" -ForegroundColor Green
        Write-Host "`nCopy this to your .env.local as NEXTAUTH_SECRET" -ForegroundColor Yellow
    } else {
        Write-Host "⚠️  Could not generate secret automatically" -ForegroundColor Yellow
        Write-Host "   Please run: openssl rand -base64 32" -ForegroundColor White
    }
} catch {
    Write-Host "⚠️  openssl not found. Please generate secret manually:" -ForegroundColor Yellow
    Write-Host "   openssl rand -base64 32" -ForegroundColor White
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "`n✅ Dependencies already installed" -ForegroundColor Green
}

# Check for POSTGRES_URL in .env.local
if (Test-Path ".env.local") {
    $envContent = Get-Content ".env.local" -Raw
    if ($envContent -match "POSTGRES_URL=postgresql://") {
        Write-Host "`n✅ POSTGRES_URL found in .env.local" -ForegroundColor Green
        
        $runMigration = Read-Host "`nDo you want to run database migration now? (y/N)"
        if ($runMigration -eq "y" -or $runMigration -eq "Y") {
            Write-Host "`n🔄 Running database migration..." -ForegroundColor Yellow
            npm run migrate
            Write-Host "✅ Migration completed!" -ForegroundColor Green
        }
    } else {
        Write-Host "`n⚠️  POSTGRES_URL not configured in .env.local" -ForegroundColor Yellow
        Write-Host "   Please add your Vercel Postgres connection string" -ForegroundColor White
    }
}

Write-Host "`n✨ Setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env.local with your Vercel Postgres URL" -ForegroundColor White
Write-Host "2. Run: npm run migrate (to create users table)" -ForegroundColor White
Write-Host "3. Run: npm run dev (to start development server)" -ForegroundColor White
Write-Host "4. Visit: http://localhost:9090/login" -ForegroundColor White
Write-Host "`n"

