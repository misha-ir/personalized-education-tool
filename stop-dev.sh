#!/bin/bash

echo "🛑 Stopping Personalized Education Tool Development Environment..."
echo ""

# Check if we're in the project root directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   Expected directories: backend/ and frontend/"
    exit 1
fi

# Stop any running Node.js processes (frontend and backend)
echo "🔄 Stopping Node.js processes..."
if pgrep -f "vite\|tsx.*src/index.ts" > /dev/null; then
    pkill -f "vite\|tsx.*src/index.ts"
    echo "✅ Node.js processes stopped"
else
    echo "ℹ️  No Node.js processes found running"
fi

# Stop MongoDB container
echo "🔄 Stopping MongoDB container..."
cd backend
if docker compose down; then
    echo "✅ MongoDB container stopped"
else
    echo "⚠️  MongoDB container may not be running or failed to stop"
fi

# Clean up log files
cd ..
if [ -f "backend.log" ]; then
    rm backend.log
    echo "✅ Cleaned up log files"
fi

echo ""
echo "✅ Development environment stopped successfully!"
echo "   All services have been shut down."
echo ""
echo "🚀 To restart, run: ./start-dev.sh"
