#!/bin/bash

echo "🚀 Preparing BNB Airdrop Platform for Vercel deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run type checking
echo "🔍 Running type checks..."
npm run check

# Test build locally
echo "🔨 Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to Vercel
    echo "🌐 Deploying to Vercel..."
    vercel --prod
    
    echo "🎉 Deployment complete!"
    echo "Your app is now live on Vercel!"
else
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi