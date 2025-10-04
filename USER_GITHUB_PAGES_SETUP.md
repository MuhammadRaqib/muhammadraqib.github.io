# User GitHub Pages Setup (muhammadraqib.github.io)

This guide shows how to deploy EcoTrack to your user GitHub Pages site.

## Option 1: Deploy to Subdirectory (Recommended)

### Repository Setup
1. Create a repository named `ecotrack-waste-management`
2. Push your code to this repository
3. Your app will be available at: `https://muhammadraqib.github.io/ecotrack-waste-management/`

### Steps:
1. **Create Repository:**
   ```bash
   # Create new repository on GitHub named 'ecotrack-waste-management'
   git init
   git add .
   git commit -m "Initial commit: EcoTrack waste management system"
   git branch -M main
   git remote add origin https://github.com/muhammadraqib/ecotrack-waste-management.git
   git push -u origin main
   ```

2. **Set up GitHub Pages:**
   - Go to repository Settings > Pages
   - Source: GitHub Actions
   - The workflow will automatically deploy

3. **Set Firebase Secrets:**
   - Go to repository Settings > Secrets and variables > Actions
   - Add all required Firebase secrets

## Option 2: Deploy to Root Domain

### Repository Setup
1. Create a repository named `muhammadraqib.github.io`
2. Push your code to this repository
3. Your app will be available at: `https://muhammadraqib.github.io/`

### Steps:
1. **Create Repository:**
   ```bash
   # Create new repository on GitHub named 'muhammadraqib.github.io'
   git init
   git add .
   git commit -m "Initial commit: EcoTrack waste management system"
   git branch -M main
   git remote add origin https://github.com/muhammadraqib/muhammadraqib.github.io.git
   git push -u origin main
   ```

2. **Set up GitHub Pages:**
   - Go to repository Settings > Pages
   - Source: GitHub Actions
   - The workflow will automatically deploy

3. **Set Firebase Secrets:**
   - Go to repository Settings > Secrets and variables > Actions
   - Add all required Firebase secrets

## Configuration Differences

### For Subdirectory Deployment (ecotrack-waste-management):
- ✅ Base path: `/` (root)
- ✅ URL: `https://muhammadraqib.github.io/ecotrack-waste-management/`
- ✅ Can have multiple projects on your GitHub Pages

### For Root Domain Deployment (muhammadraqib.github.io):
- ✅ Base path: `/` (root)
- ✅ URL: `https://muhammadraqib.github.io/`
- ✅ Your main GitHub Pages site
- ⚠️ This will replace any existing content at your root domain

## Required Firebase Secrets

For both options, you need to set these secrets in your repository:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

## Deployment Process

1. **Push code** to your repository
2. **GitHub Actions** will automatically build and deploy
3. **Check deployment** in the Actions tab
4. **Visit your app** at the configured URL

## Troubleshooting

### If deployment fails:
1. Check that all Firebase secrets are set correctly
2. Verify repository is public
3. Check GitHub Actions logs for specific errors
4. Ensure Node.js 20+ is being used (configured in workflow)

### If app doesn't load:
1. Check the base path in `vite.config.ts` (should be `/`)
2. Verify GitHub Pages is enabled
3. Check Firebase configuration
4. Look for console errors in browser

## Custom Domain (Optional)

If you have a custom domain:
1. Add a `CNAME` file to your repository root with your domain
2. Configure DNS to point to `muhammadraqib.github.io`
3. Update the base path in `vite.config.ts` if needed

## Multiple Projects

If you want multiple projects on your GitHub Pages:
- Use subdirectory deployment for each project
- Each project gets its own repository
- URLs will be: `muhammadraqib.github.io/project-name/`
