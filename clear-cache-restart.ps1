# Clear Next.js cache and restart dev server
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CLEAR CACHE VA RESTART DEV SERVER" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Stop any running dev server
Write-Host "Dang stop dev server (neu co)..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*node*" } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Remove .next folder
Write-Host "Dang xoa .next folder..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "✅ Da xoa .next folder" -ForegroundColor Green
} else {
    Write-Host "⚠️  .next folder khong ton tai" -ForegroundColor Yellow
}

# Clear node_modules/.cache if exists
Write-Host "Dang clear node_modules cache..." -ForegroundColor Yellow
if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force "node_modules\.cache"
    Write-Host "✅ Da clear node_modules cache" -ForegroundColor Green
}

Write-Host "`n✅ Hoan tat clear cache!" -ForegroundColor Green
Write-Host "`nCan restart dev server:" -ForegroundColor Yellow
Write-Host "  npm run dev`n" -ForegroundColor White

