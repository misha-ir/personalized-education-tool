#!/bin/bash

echo "🚀 Starting Personalized Education Tool Development Environment..."
echo ""

# Check if we're in the project root directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   Expected directories: backend/ and frontend/"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node > /dev/null 2>&1; then
    echo "❌ Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Start MongoDB with Docker Compose
echo "🔄 Starting MongoDB container..."
cd backend
if docker compose up -d; then
    echo "✅ MongoDB container started successfully"
else
    echo "❌ Failed to start MongoDB container"
    exit 1
fi

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
sleep 3

# Start backend server in background
echo "🔄 Starting backend server..."
if npm run dev > ../backend.log 2>&1 &
then
    BACKEND_PID=$!
    echo "✅ Backend server started (PID: $BACKEND_PID)"
    echo "   Backend running at: http://localhost:3001"
    echo "   Logs: tail -f backend.log"
else
    echo "❌ Failed to start backend server"
    docker compose down
    exit 1
fi

# Wait for backend to initialize
echo "⏳ Waiting for backend to initialize..."
sleep 5

# Start frontend server
echo "🔄 Starting frontend server..."
cd ../frontend

echo "✅ Development environment is ready!"
echo ""
echo "📡 Services:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3001"
echo "   MongoDB:  mongodb://localhost:27017/pet_dev"
echo ""
echo "📝 To stop all services, run: ./stop-dev.sh"
echo "🔄 To reset database, run: ./reset-dev.sh"
echo ""
echo "🖥️  Starting frontend server (Ctrl+C to stop all services)..."

# Start frontend in foreground so user can see logs and stop with Ctrl+C
if npm run dev; then
    echo "Frontend server stopped."
else
    echo "❌ Frontend server encountered an error"
fi

# Cleanup when frontend stops
echo ""
echo "🔄 Cleaning up..."

# Kill backend process
if kill $BACKEND_PID > /dev/null 2>&1; then
    echo "✅ Backend server stopped"
else
    echo "⚠️  Backend server may still be running"
fi

# Stop MongoDB container
cd ../backend
if docker compose down; then
    echo "✅ MongoDB container stopped"
else
    echo "⚠️  MongoDB container may still be running"
fi

echo "🛑 Development environment stopped"
