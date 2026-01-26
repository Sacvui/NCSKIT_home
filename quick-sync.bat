@echo off
title Auto-Sync to ncsstat_kiro

echo ========================================
echo   AUTO-SYNC TO NCSSTAT_KIRO REPOSITORY
echo ========================================

:: Set colors
set GREEN=[92m
set YELLOW=[93m
set RED=[91m
set CYAN=[96m
set RESET=[0m

echo.
echo %YELLOW%📝 Staging all changes...%RESET%
git add .

echo.
echo %YELLOW%💾 Committing changes...%RESET%
git commit -m "Auto-sync: %date% %time%"

echo.
echo %YELLOW%🔗 Setting up remote repository...%RESET%
git remote remove ncsstat_kiro 2>nul
git remote add ncsstat_kiro https://github.com/hailp1/ncsstat_kiro.git

echo.
echo %YELLOW%📤 Pushing to ncsstat_kiro...%RESET%
git push ncsstat_kiro main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo %GREEN%✅ SUCCESS! Code synced to ncsstat_kiro%RESET%
    echo %CYAN%🔗 https://github.com/hailp1/ncsstat_kiro%RESET%
    echo.
    echo %GREEN%🎉 All security fixes are now live!%RESET%
) else (
    echo.
    echo %RED%❌ SYNC FAILED - Authentication needed%RESET%
    echo.
    echo %YELLOW%🔐 AUTHENTICATION STEPS:%RESET%
    echo 1. Go to: https://github.com/settings/tokens
    echo 2. Generate new token with 'repo' permissions  
    echo 3. Use token as password when prompted
    echo 4. Run this script again
    echo.
    start https://github.com/settings/tokens
)

echo.
pause