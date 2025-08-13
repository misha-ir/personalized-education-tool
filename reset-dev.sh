#!/bin/bash

echo "Resetting Personalized Education Tool Development Environment..."
echo ""
echo "⚠️  This will:"
echo "   - Stop all running services"
echo "   - Clear uploaded files"
echo "   - Reset the database"
echo "   - Restart all services"
echo ""

read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Reset cancelled"
    exit 1
fi

echo "Stopping current services..."

# Check if we're in the project root directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   Expected directories: backend/ and frontend/"
    exit 1
fi

# Stop any running Node.js processes
if pgrep -f "vite\|tsx.*src/index.ts" > /dev/null; then
    pkill -f "vite\|tsx.*src/index.ts"
    echo "✅ Node.js processes stopped"
fi

# Stop MongoDB container (but keep it for reset operations)
cd backend
echo "🔄 Preparing MongoDB for reset..."
docker compose down > /dev/null 2>&1

# Start MongoDB for database operations
echo "🔄 Starting MongoDB for reset operations..."
if ! docker compose up -d; then
    echo "❌ Failed to start MongoDB container for reset"
    exit 1
fi

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
sleep 5

# Clear uploaded files
echo "🧹 Clearing uploaded files..."
if [ -d "uploads" ]; then
    rm -rf uploads/*
    echo "✅ Uploaded files cleared"
else
    echo "No uploads directory found"
fi

# Clear database
echo "🧹 Clearing database..."
if docker compose exec -T mongo mongosh --eval "db.files.deleteMany({})" pet_dev > /dev/null 2>&1; then
    echo "✅ Database cleared successfully"
else
    echo "⚠️  Database clear may have failed, but continuing..."
fi

# Clean up log files
cd ..
if [ -f "backend.log" ]; then
    rm backend.log
fi

echo ""
echo "✅ Reset completed! Starting fresh development environment..."
echo ""

# Restart the development environment
exec ./start-dev.sh
