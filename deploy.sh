#!/bin/bash

echo "=================================="
echo "Event Website Deployment Script"
echo "=================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git repository not initialized!"
    exit 1
fi

echo "✅ Git repository ready"
echo ""

# Check for GitHub CLI
if command -v gh &> /dev/null; then
    echo "📦 GitHub CLI found!"
    read -p "Create GitHub repository and push? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        gh repo create event-ai-beyond-hype --public --source=. --push
        echo "✅ Pushed to GitHub!"
    fi
else
    echo "⚠️  GitHub CLI not found. Install with: brew install gh"
    echo ""
    echo "Manual setup instructions:"
    echo "1. Create repo at: https://github.com/new"
    echo "2. Run: git remote add origin YOUR_REPO_URL"
    echo "3. Run: git push -u origin main"
fi

echo ""

# Check for Railway CLI
if command -v railway &> /dev/null; then
    echo "🚂 Railway CLI found!"
    read -p "Deploy to Railway? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        railway up
        echo "✅ Deployed to Railway!"
        echo ""
        echo "Get your URL with: railway domain"
    fi
else
    echo "⚠️  Railway CLI not found. Install with: npm install -g @railway/cli"
    echo ""
    echo "Alternative: Deploy via Railway.app web interface"
    echo "1. Go to: https://railway.app"
    echo "2. Click 'New Project' → 'Deploy from GitHub repo'"
    echo "3. Select your repository"
fi

echo ""
echo "=================================="
echo "Deployment script complete!"
echo "See DEPLOYMENT.md for detailed instructions"
echo "=================================="
