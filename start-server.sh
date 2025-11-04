#!/bin/bash

# Simple web server starter script

PORT=8000
DIR="/home/dev/brent-ai-server"

echo "🚀 Starting web server..."
echo "📁 Serving files from: $DIR"
echo "🌐 Server will be available at: http://localhost:$PORT"
echo ""
echo "Press Ctrl+C to stop the server"
echo "-----------------------------------"

cd "$DIR" && python3 -m http.server $PORT
