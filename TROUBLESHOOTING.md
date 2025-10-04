# Troubleshooting Guide

## Common Deployment Issues

### 1. Node.js Version Error

**Error:**
```
npm warn EBADENGINE   package: '@firebase/app@0.14.3',
npm warn EBADENGINE   required: { node: '>=20.0.0' },
npm warn EBADENGINE   current: { node: 'v18.20.8', npm: '10.8.2' }
```

**Cause:** Firebase v12+ requires Node.js 20 or higher

**Solutions:**

#### For Local Development:
1. **Upgrade Node.js to version 20+:**
   ```bash
   # Using nvm (recommended)
   nvm install 20
   nvm use 20
   
   # Or download from https://nodejs.org/
   ```

2. **Check your Node.js version:**
   ```bash
   node -v  # Should show v20.x.x or higher
   ```

3. **Clear npm cache and reinstall:**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

#### For GitHub Actions:
The workflow has been updated to use Node.js 20, so this should be resolved automatically.

### 2. Permission Denied Error

**Error:**
```
remote: Permission to MuhammadRaqib/raqib_qayoom.github.io.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/MuhammadRaqib/raqib_qayoom.github.io.git/': The requested URL returned error: 403
```

**Causes:**
- GitHub Actions trying to push to wrong repository
- Insufficient permissions for GitHub Actions
- Repository settings not configured properly

**Solutions:**

#### Solution A: Use Updated Workflow (Recommended)
The main workflow now uses the newer GitHub Pages deployment method that should work automatically.

#### Solution B: Switch to Alternative Workflow
1. Rename the current workflow:
   ```bash
   mv .github/workflows/deploy.yml .github/workflows/deploy-backup.yml
   ```
2. Use the alternative workflow:
   ```bash
   mv .github/workflows/deploy-alternative.yml .github/workflows/deploy.yml
   ```

#### Solution C: Check Repository Settings
1. **Repository must be public** (required for GitHub Pages)
2. Go to **Settings** > **Actions** > **General**
3. Under **Workflow permissions**, select **Read and write permissions**
4. Check **Allow GitHub Actions to create and approve pull requests**

### 2. Build Fails

**Error:** Build step fails with missing environment variables

**Solution:**
1. Check that all Firebase secrets are set in GitHub repository
2. Verify secret names match exactly (case-sensitive)
3. Check the Actions tab for detailed error logs

**Required Secrets:**
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### 3. App Doesn't Load After Deployment

**Symptoms:**
- GitHub Pages shows 404 or blank page
- App loads but shows Firebase connection errors

**Solutions:**

#### Check Base Path
1. Verify your repository name matches the base path in `vite.config.ts`
2. If repository is `ecotrack-waste-management`, the base path should be `/ecotrack-waste-management/`

#### Check Firebase Configuration
1. Verify all secrets are correctly set
2. Check Firebase Console to ensure project is active
3. Ensure Firestore is enabled

#### Check GitHub Pages Settings
1. Go to **Settings** > **Pages**
2. Ensure source is set to **GitHub Actions**
3. Check that deployment completed successfully

### 4. Firebase Connection Issues

**Error:** Firebase connection fails in deployed app

**Solutions:**
1. **Check Environment Variables:**
   - Verify all Firebase secrets are set correctly
   - Check that values match your Firebase Console exactly

2. **Check Firebase Project:**
   - Ensure project is not paused
   - Verify Firestore is enabled
   - Check security rules allow access

3. **Check Network:**
   - Verify Firebase project is accessible
   - Check for any firewall restrictions

### 5. Local Development Issues

**Error:** App doesn't work locally

**Solution:**
1. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your Firebase configuration
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

### 6. GitHub Actions Not Triggering

**Symptoms:**
- No deployment happens when pushing to main branch
- Workflow doesn't appear in Actions tab

**Solutions:**
1. **Check workflow file:**
   - Ensure `.github/workflows/deploy.yml` exists
   - Verify YAML syntax is correct

2. **Check branch name:**
   - Workflow triggers on `main` or `master` branches
   - Ensure you're pushing to the correct branch

3. **Check repository settings:**
   - Go to **Settings** > **Actions** > **General**
   - Ensure Actions are enabled

## Getting Help

### Check These First:
1. **GitHub Actions Logs:** Go to Actions tab and check the latest run
2. **Firebase Console:** Verify project settings and data
3. **Browser Console:** Check for client-side errors
4. **Repository Settings:** Ensure Pages and Actions are properly configured

### Common Fixes:
1. **Re-run failed workflow:** Go to Actions tab and click "Re-run all jobs"
2. **Clear cache:** Delete `.next` or `dist` folders and rebuild
3. **Check secrets:** Verify all required secrets are set correctly
4. **Update workflow:** Use the latest workflow version

### Still Having Issues?
1. Check the GitHub Actions logs for specific error messages
2. Verify all environment variables are set correctly
3. Ensure your repository is public (required for GitHub Pages)
4. Check that Firebase project is active and properly configured
