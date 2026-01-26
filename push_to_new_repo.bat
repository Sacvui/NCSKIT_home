@echo off
echo ========================================
echo  PUSHING FIXED CODE TO NEW REPOSITORY
echo ========================================

echo.
echo Step 1: Setting up new remote...
git remote remove new-origin 2>nul
git remote add new-origin https://github.com/hailp1/ncsstat_kiro.git

echo.
echo Step 2: Checking current status...
git status --short

echo.
echo Step 3: Pushing to new repository...
echo NOTE: You may need to enter your GitHub username and Personal Access Token
echo.
git push new-origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo  SUCCESS! Code pushed to new repository
    echo ========================================
    echo.
    echo Repository URL: https://github.com/hailp1/ncsstat_kiro
    echo.
    echo CRITICAL FIXES APPLIED:
    echo - Fixed localStorage-first auth vulnerability
    echo - Added secure ORCID cookie validation  
    echo - Implemented analysis result caching
    echo - Added WebR error recovery mechanism
    echo - Removed dangerous build configuration
    echo - Added comprehensive security headers
    echo.
    echo See SECURITY_FIXES_SUMMARY.md for complete details
    echo.
) else (
    echo.
    echo ========================================
    echo  PUSH FAILED - MANUAL STEPS REQUIRED
    echo ========================================
    echo.
    echo Option 1: Use Personal Access Token
    echo 1. Go to GitHub Settings ^> Developer settings ^> Personal access tokens
    echo 2. Generate new token with 'repo' permissions
    echo 3. Use token as password when prompted
    echo.
    echo Option 2: Use the bundle file
    echo 1. Upload ncsstat_kiro_fixed.bundle to the new repository
    echo 2. Clone the new repo and run: git pull ncsstat_kiro_fixed.bundle
    echo.
    echo Option 3: Manual upload
    echo 1. Download this folder as ZIP
    echo 2. Upload to GitHub via web interface
    echo.
)

pause