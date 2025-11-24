#!/bin/bash
# Development startup script for Meetink monorepo

echo "🚀 Starting Meetink Development Servers..."
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command_exists python3; then
    echo "❌ Python 3 is not installed. Please install Python 3.10+ first."
    exit 1
fi

# Start Python GraphQL server in background
echo "📦 Starting Python GraphQL Server (port 8000)..."
(
    cd server
    if [ ! -d ".venv" ]; then
        echo "Creating Python virtual environment..."
        python3 -m venv .venv
    fi

    source .venv/bin/activate
    pip install -q -r requirements.txt

    # Check if .env exists
    if [ ! -f ".env" ]; then
        echo "⚠️  No .env file found in server/. Copying from .env.example..."
        cp .env.example .env
    fi

    # Run Python server
    python main.py
) > server.log 2>&1 &

SERVER_PID=$!
echo $SERVER_PID > server.pid

echo "✅ GraphQL Server started (PID: $SERVER_PID)"
echo ""

sleep 2  # Give server time to start

# Start Next.js frontend in background
echo "⚛️  Starting Next.js Frontend (port 3000)..."
(
    cd frontend

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "Installing npm dependencies..."
        npm install
    fi

    # Check if .env.local exists
    if [ ! -f ".env.local" ]; then
        echo "⚠️  No .env.local file found in frontend/. Copying from .env.example..."
        cp .env.example .env.local
    fi

    npm run dev
) > frontend.log 2>&1 &

FRONTEND_PID=$!
echo $FRONTEND_PID > frontend.pid

echo "✅ Frontend started (PID: $FRONTEND_PID)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Meetink is running!"
echo ""
echo "🌐 Frontend:         http://localhost:3000"
echo "🔌 GraphQL Server:   http://localhost:8000"
echo "🔍 GraphQL Explorer: http://localhost:8000/graphql"
echo ""
echo "📝 Logs: server.log | frontend.log"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Press Ctrl+C to stop all servers"

# Trap Ctrl+C and kill both processes
trap "echo ''; echo '🛑 Stopping servers...'; kill $SERVER_PID $FRONTEND_PID 2>/dev/null; rm -f server.pid frontend.pid; exit" INT

# Wait for both processes
wait