#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deep clean and rebuild..."

# 1. Clean Node Modules
echo "📦 Cleaning Node.js dependencies..."
rm -rf node_modules
rm -f yarn.lock
rm -f package-lock.json

# 2. Reinstall Dependencies (Essential for Gradle to find React Native plugins)
echo "📥 Installing dependencies..."
npm install --legacy-peer-deps

# 3. Clean Android Build artifacts
echo "🤖 Cleaning Android build files..."
cd android
rm -rf build
rm -rf app/build
rm -rf .gradle
rm -rf app/.cxx
./gradlew clean
cd ..

# 4. Final instructions
echo "✅ Clean rebuild complete!"
echo "To run the app, use: npm run android (for Android) or npm run ios (for iOS)"
