#!/bin/bash

# Simple deployment script for BNB Airdrop Platform
echo "🚀 Building BNB Airdrop Platform for deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Create deployment package
echo "📁 Creating deployment package..."
mkdir -p deploy-package

# Copy built files
cp -r dist/* deploy-package/
cp package.json deploy-package/
cp package-lock.json deploy-package/

# Copy server files
cp -r server deploy-package/
cp -r shared deploy-package/

# Create production package.json
cat > deploy-package/package.json << EOF
{
  "name": "bnb-airdrop-platform",
  "version": "1.0.0",
  "type": "module",
  "main": "server/index.js",
  "scripts": {
    "start": "node server/index.js",
    "dev": "node server/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3"
  }
}
EOF

echo "✅ Deployment package ready in ./deploy-package/"
echo "🌐 To deploy:"
echo "   1. Upload deploy-package folder to your server"
echo "   2. Run: cd deploy-package && npm install"
echo "   3. Run: npm start"
echo "   4. Access at http://your-domain:5000"