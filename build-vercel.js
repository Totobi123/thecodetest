#!/usr/bin/env node

// Simplified build script for Vercel deployment
import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 Building for Vercel deployment...');

try {
  // Build only the frontend (faster)
  console.log('📦 Building frontend...');
  execSync('vite build', { stdio: 'inherit' });
  
  console.log('✅ Build complete!');
  console.log('📁 Frontend built to ./dist');
  console.log('🔧 API routes ready in ./api');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}