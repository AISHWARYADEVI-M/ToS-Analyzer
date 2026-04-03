@echo off
REM automated Git Upload Script for ToS Analyzer
REM This script handles the git setup and upload to GitHub

echo.
echo ========================================
echo   ToS Analyzer - GitHub Upload Script
echo ========================================
echo.

REM Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed or not in PATH
    echo.
    echo Please install Git first:
    echo 1. Go to https://git-scm.com/download/win
    echo 2. Download and run the installer
    echo 3. Accept all default options
    echo 4. **CLOSE this window and open a NEW PowerShell**
    echo 5. Run this script again
    echo.
    pause
    exit /b 1
)

echo Git found: 
git --version
echo.

REM Navigate to project directory
cd /d "c:\Users\parsh\Downloads\tos-analyzer\tos-analyzer"
if %errorlevel% neq 0 (
    echo ERROR: Could not navigate to project directory
    pause
    exit /b 1
)

echo Project directory: %cd%
echo.

REM Check if git is already initialized
if exist .git (
    echo Git repository already initialized
    echo.
    echo Checking status...
    git status
    echo.
    echo Repository already has a git history.
    echo.
    REM Ask if they want to reset
    set /p reset="Reset repository and start fresh? (y/n): "
    if /i "%reset%"=="y" (
        echo Removing old git history...
        rmdir /s /q .git
        echo Removed.
    ) else (
        echo Keeping existing repository.
    )
) else (
    echo Git repository not yet initialized
)

echo.
echo Step 1: Initialize Git Repository
echo.
git init
if %errorlevel% neq 0 (
    echo ERROR: Failed to initialize git repository
    pause
    exit /b 1
)

echo.
echo Step 2: Add all files
echo.
git add .
if %errorlevel% neq 0 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)

echo.
echo Files staged for commit. Showing status:
echo.
git status
echo.

echo.
echo Step 3: Create initial commit
echo.
git commit -m "Initial commit: ToS Guard with AI-powered analysis and Chrome Extension"
if %errorlevel% neq 0 (
    echo ERROR: Failed to create commit
    pause
    exit /b 1
)

echo.
echo Step 4: Add remote repository
echo.
REM Check if remote already exists
git remote | find "origin" >nul
if %errorlevel% equ 0 (
    echo Remote 'origin' already exists
    echo Removing old remote...
    git remote remove origin
)

git remote add origin https://github.com/parnika760/TOS_Analyser.git
if %errorlevel% neq 0 (
    echo ERROR: Failed to add remote
    pause
    exit /b 1
)

echo Remote added successfully
echo.

echo.
echo Step 5: Set main branch and push
echo.
git branch -M main

echo.
echo ========================================
echo   READY TO PUSH TO GITHUB
echo ========================================
echo.
echo Next command: git push -u origin main
echo.
echo If prompted for authentication:
echo   Username: parnika760
echo   Password: [Use your GitHub Personal Access Token]
echo.
echo Don't have a PAT? Create one:
echo   1. Go to https://github.com/settings/tokens
echo   2. Click "Generate new token"
echo   3. Select "repo" scope
echo   4. Copy the token and paste it as the password
echo.
echo.
set /p push="Ready to push? (y/n): "
echo.
if /i "%push%"=="y" (
    echo Pushing to GitHub...
    echo.
    git push -u origin main
    if %errorlevel% equ 0 (
        echo.
        echo ========================================
        echo   SUCCESS! Project uploaded to GitHub
        echo ========================================
        echo.
        echo View your repository at:
        echo   https://github.com/parnika760/TOS_Analyser
        echo.
        pause
    ) else (
        echo.
        echo ERROR: Push failed. Check your authentication and network.
        echo See the error message above for details.
        pause
        exit /b 1
    )
) else (
    echo Push cancelled. Run this script again or use:
    echo   git push -u origin main
    pause
)
