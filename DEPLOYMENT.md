# Complete Vercel Deployment Guide

## Quick Deploy to Vercel

### Method 1: One-Click Deploy (Recommended)
1. Fork this repository to your GitHub account
2. Go to [vercel.com](https://vercel.com) and sign up/login
3. Click "New Project" and import your forked repository
4. Vercel will automatically detect it's a React/Vite project
5. Click "Deploy" - No configuration needed!

### Method 2: Vercel CLI Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow the prompts:
# ? Set up and deploy "bnb-airdrop-platform"? [Y/n] y
# ? Which scope do you want to deploy to? [Your Team]
# ? Link to existing project? [y/N] n
# ? What's your project's name? bnb-airdrop-platform
# ? In which directory is your code located? ./client
```

### Method 3: GitHub Integration
1. Connect your GitHub account to Vercel
2. Import the repository
3. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - **Root Directory**: `client`

## Build Configuration

The project includes a `vercel.json` configuration file:

```json
{
  "version": 2,
  "name": "bnb-airdrop-platform",
  "buildCommand": "cd client && npm run build",
  "outputDirectory": "client/dist",
  "installCommand": "cd client && npm install",
  "framework": "vite"
}
```

## Environment Setup

No environment variables required - the app runs entirely in the browser!

## Deployment Steps

1. **Prepare Repository**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to vercel.com/dashboard
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Custom Domain (Optional)**
   - Go to your project dashboard
   - Click "Domains"
   - Add your custom domain
   - Update DNS records as shown

## Automatic Deployments

Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: When you create pull requests

## Performance Optimization

The build includes:
- ✅ Code splitting
- ✅ Asset optimization
- ✅ Gzip compression
- ✅ Fast global CDN
- ✅ Automatic HTTPS

## Troubleshooting

### Build Fails
```bash
# Check if build works locally
cd client
npm install
npm run build
```

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf client/node_modules
rm client/package-lock.json
cd client && npm install
```

### Deployment Logs
- Go to Vercel dashboard
- Click on your project
- Check "Functions" tab for errors

## Custom Configuration

### Custom Build Command
If you need a custom build command, update `vercel.json`:
```json
{
  "buildCommand": "cd client && npm run build:production"
}
```

### Environment Variables (if needed)
Add in Vercel dashboard under "Settings > Environment Variables"

## Security Headers

Add to `vercel.json` for enhanced security:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## Success! 🎉

Your BNB Airdrop Platform is now live at:
- **Production URL**: `https://your-project.vercel.app`
- **Custom Domain**: `https://your-domain.com` (if configured)

## Maintenance

- **Updates**: Push to main branch for automatic deployment
- **Monitoring**: Check Vercel dashboard for analytics
- **Scaling**: Vercel handles automatic scaling

---

**Made with ❤️ by GENX** | Contact: +234 807 130 9276