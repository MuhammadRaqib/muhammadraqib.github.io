#!/bin/bash

# EcoTrack Local Development Setup Script

echo "🚀 Setting up EcoTrack for local development..."

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version 20+ is required. Current version: $(node -v)"
    echo "📝 Please upgrade Node.js:"
    echo "   - Visit: https://nodejs.org/"
    echo "   - Or use nvm: nvm install 20 && nvm use 20"
    exit 1
fi

echo "✅ Node.js version check passed: $(node -v)"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp env.example .env.local
    echo "✅ Created .env.local"
    echo "⚠️  Please edit .env.local with your Firebase configuration"
else
    echo "✅ .env.local already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env.local with your Firebase configuration"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo ""
echo "🔐 Security reminder: Never commit .env.local to git!"
