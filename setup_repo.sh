#!/bin/bash

# Script to initialize Git repository and prepare for deployment

echo "🚀 Setting up Git repository for CreatorSync..."

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: CreatorSync - AI-Powered IP Licensing Marketplace"

echo "✅ Git repository initialized!"
echo ""
echo "📝 Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Run: git remote add origin <your-repo-url>"
echo "3. Run: git branch -M main"
echo "4. Run: git push -u origin main"
echo ""
echo "🌐 Then deploy to Vercel:"
echo "1. Go to https://vercel.com"
echo "2. Import your GitHub repository"
echo "3. Add environment variables"
echo "4. Deploy!"

