# Setup and Deploy - Quick Guide

Your event website is ready! Follow these simple steps to deploy to GitHub and Railway.

## Step 1: Authenticate with GitHub ✅

GitHub CLI is installed! Now authenticate:

```bash
gh auth login
```

Follow the prompts:
1. Choose: **GitHub.com**
2. Choose: **HTTPS**
3. Authenticate with: **Login with a web browser** (easiest)
4. Copy the one-time code shown
5. Press Enter to open GitHub in your browser
6. Paste the code and authorize

## Step 2: Create Repository and Push to GitHub 🚀

Once authenticated, run this single command:

```bash
gh repo create event-ai-beyond-hype --public --source=. --push
```

This will:
- ✅ Create a new GitHub repository called `event-ai-beyond-hype`
- ✅ Push all your code
- ✅ Set up the remote connection
- ✅ Make it public

Your repository will be at: `https://github.com/YOUR_USERNAME/event-ai-beyond-hype`

## Step 3: Deploy to Railway 🚂

### Option A: Deploy via Railway Web Interface (Easiest)

1. Go to [railway.app](https://railway.app)
2. Click "Login" → Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose `event-ai-beyond-hype`
6. Railway will automatically detect and deploy your static site
7. Click "Generate Domain" to get your live URL

**Done!** Your site will be live in ~2 minutes at the Railway URL.

### Option B: Deploy via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Or with Homebrew
brew install railway

# Login
railway login

# Initialize project
railway init

# Link to your GitHub repo (optional but recommended)
railway link

# Deploy
railway up

# Get your live URL
railway domain
```

## All-in-One Deployment Script 🎯

For future deployments, just run:

```bash
./deploy.sh
```

This automated script will check your setup and guide you through deployment.

## What You'll Get 🎉

### GitHub Repository
- Full source code
- Version control
- Collaboration ready
- Free hosting via GitHub Pages option

### Railway Deployment
- Live website URL
- Automatic HTTPS
- Global CDN
- Instant updates when you push to GitHub

## Quick Reference Commands

```bash
# View your git status
git status

# Make updates and push
git add .
git commit -m "Your update message"
git push

# Railway will auto-deploy from GitHub, or manually:
railway up

# View your Railway deployment
railway open
```

## Repository Structure

```
event-ai-beyond-hype/
├── index.html              # Main website
├── styles.css              # All styling
├── script.js               # Interactivity
├── images/                 # All images from PDF
│   ├── guests/            # 30 guest profiles
│   ├── hero-background.png
│   ├── whiteboardwave.png
│   ├── blackboardwave.png
│   └── eventpartner.png
├── README.md              # Documentation
├── DEPLOYMENT.md          # Detailed deployment guide
└── railway.json           # Railway configuration

56 files total - All ready for deployment!
```

## Need Help?

- GitHub auth issues: `gh auth login`
- Railway issues: Check [docs.railway.app](https://docs.railway.app)
- View this guide: `cat SETUP-AND-DEPLOY.md`

---

**Ready to deploy! Start with Step 1 above.** 🚀
