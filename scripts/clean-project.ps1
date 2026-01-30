# Clean Project Script
# Removes build cache and temporary files to reduce project size

Write-Host "🗑️  Cleaning ncsStat project..." -ForegroundColor Cyan
Write-Host ""

$initialSize = (Get-ChildItem -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1GB

# 1. Clean .next build cache
if (Test-Path .next) {
    Write-Host "📦 Removing .next build cache..." -ForegroundColor Yellow
    $nextSize = (Get-ChildItem .next -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
    Write-Host "   ✅ Removed .next ($([math]::Round($nextSize, 0)) MB freed)" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  .next not found (already clean)" -ForegroundColor Gray
}

# 2. Clean coverage reports
if (Test-Path coverage) {
    Write-Host "📊 Removing coverage reports..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force coverage -ErrorAction SilentlyContinue
    Write-Host "   ✅ Removed coverage" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  coverage not found (already clean)" -ForegroundColor Gray
}

# 3. Clean TypeScript build info
Write-Host "📝 Removing TypeScript build info..." -ForegroundColor Yellow
$tsbuildCount = (Get-ChildItem -Recurse -Filter "*.tsbuildinfo" -ErrorAction SilentlyContinue | Measure-Object).Count
if ($tsbuildCount -gt 0) {
    Get-ChildItem -Recurse -Filter "*.tsbuildinfo" -ErrorAction SilentlyContinue | Remove-Item -Force
    Write-Host "   ✅ Removed $tsbuildCount .tsbuildinfo files" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  No .tsbuildinfo files found" -ForegroundColor Gray
}

# 4. Clean npm cache (optional)
Write-Host "🗂️  Cleaning npm cache..." -ForegroundColor Yellow
npm cache clean --force 2>$null
Write-Host "   ✅ npm cache cleaned" -ForegroundColor Green

# 5. Show results
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
$finalSize = (Get-ChildItem -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1GB
$saved = $initialSize - $finalSize

Write-Host "📊 Cleanup Results:" -ForegroundColor Cyan
Write-Host "   Before: $([math]::Round($initialSize, 2)) GB" -ForegroundColor Yellow
Write-Host "   After:  $([math]::Round($finalSize, 2)) GB" -ForegroundColor Green
Write-Host "   Saved:  $([math]::Round($saved, 2)) GB" -ForegroundColor Magenta
Write-Host ""
Write-Host "✅ Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Tip: Run 'npm run dev' to rebuild .next cache" -ForegroundColor Gray
