#!/bin/bash

# Start ToS Analyzer Development Environment

echo ""
echo "🚀 Starting ToS Red Flag Analyzer..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9+"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+"
    exit 1
fi

# Install/setup backend
cd backend

if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

echo "✅ Activating Python environment..."
source venv/bin/activate

echo "📦 Installing/updating backend dependencies..."
pip install -q -r requirements.txt &

# Start backend
echo ""
echo "🌐 Starting backend API (http://localhost:8000)..."
echo "⏳ First run will download the AI model (~1.6GB). This may take a few minutes..."
echo ""
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait for backend to be ready
sleep 3

# Setup frontend
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend
echo ""
echo "🎨 Starting frontend (http://localhost:5173)..."
echo ""
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
