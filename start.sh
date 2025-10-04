#!/bin/bash

echo "🚀 Starting Alumni Nexus Platform..."
echo ""

# Check if backend dependencies are installed
if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd server && npm install && cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Check if .env file exists in server
if [ ! -f "server/.env" ]; then
    echo "⚠️  Warning: server/.env file not found!"
    echo "Please copy server/.env.example to server/.env and configure it."
    exit 1
fi

echo ""
echo "✅ Starting servers..."
echo "   Frontend: http://localhost:8080"
echo "   Backend:  http://localhost:5000"
echo "   AI Demo:  http://localhost:8080/ai-demo"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start backend in background
cd server && npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 2

# Start frontend
cd .. && npm run dev &
FRONTEND_PID=$!

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on Ctrl+C
trap cleanup INT

# Wait for processes
wait
