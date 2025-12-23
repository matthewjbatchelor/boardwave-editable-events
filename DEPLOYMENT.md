# Deployment Guide

Your event website is ready to deploy! Follow these steps to push to GitHub and Railway.

## ✅ Git Repository Initialized
Your code has been committed to a local git repository with all files ready to push.

---

## 🚀 Deploy to GitHub

### Option 1: Using GitHub CLI (Recommended)
```bash
# Install GitHub CLI if not already installed
brew install gh

# Login to GitHub
gh auth login

# Create repository and push
gh repo create event-ai-beyond-hype --public --source=. --push
```

### Option 2: Manual Setup
1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `event-ai-beyond-hype` (or your preferred name)
3. Don't initialize with README (we already have one)
4. Copy the repository URL
5. Run these commands:

```bash
git remote add origin https://github.com/YOUR_USERNAME/event-ai-beyond-hype.git
git branch -M main
git push -u origin main
```

---

## 🚂 Deploy to Railway.app

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
# or
brew install railway
```

### Step 2: Login to Railway
```bash
railway login
```

### Step 3: Initialize and Deploy
```bash
# Initialize Railway project
railway init

# Deploy
railway up

# Get your deployment URL
railway domain
```

### Alternative: Deploy via GitHub (Recommended)
1. Push your code to GitHub (see above)
2. Go to [Railway.app](https://railway.app)
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `event-ai-beyond-hype` repository
6. Railway will auto-detect it's a static site and deploy automatically
7. Add a custom domain or use the Railway-provided URL

---

## 📋 Railway Configuration

A `railway.json` configuration file has been created for you with optimized settings for static site deployment.

---

## 🌐 Post-Deployment

### GitHub Pages (Alternative Free Option)
If you prefer GitHub Pages over Railway:

1. Push to GitHub (see above)
2. Go to your repository Settings → Pages
3. Source: Deploy from branch `main`
4. Select folder: `/ (root)`
5. Click Save
6. Your site will be live at: `https://YOUR_USERNAME.github.io/event-ai-beyond-hype/`

---

## 🔧 Environment Setup

Your website requires no build step and runs as a static site. All images and assets are included in the repository.

### What's Included:
- ✅ All HTML, CSS, and JavaScript files
- ✅ All images extracted from PDF
- ✅ Logos (Boardwave & OC&C)
- ✅ Guest profile photos (30 guests)
- ✅ Event photos and backgrounds
- ✅ Responsive design
- ✅ Ready for production

---

## 📝 Quick Commands

```bash
# Check git status
git status

# View commit history
git log --oneline

# Push updates (after initial setup)
git add .
git commit -m "Update website content"
git push

# Redeploy to Railway
railway up
```

---

## 🆘 Need Help?

- GitHub Docs: https://docs.github.com
- Railway Docs: https://docs.railway.app
- GitHub Pages: https://pages.github.com

Your website is production-ready! 🎉
