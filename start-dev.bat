@echo off
REM Start ToS Analyzer Development Environment

echo.
echo 🚀 Starting ToS Red Flag Analyzer...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.9+
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+
    pause
    exit /b 1
)

REM Install backend dependencies if needed
cd backend
if not exist "myenv" (
    echo 📦 Creating Python virtual environment...
    python -m venv myenv
)

echo ✅ Activating Python environment...
call myenv\Scripts\activate.bat

echo 📦 Installing/updating backend dependencies...
pip install -q -r requirements.txt

REM Start backend
echo.
echo 🌐 Starting backend API (http://localhost:8000)...
echo ⏳ First run will download the AI model (~1.6GB). This may take a few minutes...
echo.
start cmd /k uvicorn main:app --reload --host 0.0.0.0 --port 8000

REM Wait for backend to be ready
timeout /t 3 /nobreak

REM Install frontend dependencies if needed
cd ..\frontend
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    npm install
)

REM Start frontend
echo.
echo 🎨 Starting frontend (http://localhost:5173)...
echo.
npm run dev

pause
