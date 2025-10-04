# GitHub Pages Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Create GitHub Repository
1. Go to GitHub and create a new repository named `ecotrack-waste-management`
2. Make it public (required for GitHub Pages)
3. Initialize with README (optional)

### 2. Push Your Code
```bash
git init
git add .
git commit -m "Initial commit: EcoTrack waste management system"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ecotrack-waste-management.git
git push -u origin main
```

### 3. Set Up Firebase Secrets
**🔐 IMPORTANT**: Never commit Firebase keys to your repository. Use GitHub secrets instead.

In your GitHub repository:
1. Go to **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret** and add each of these:

#### Required Secrets:
- **Name**: `VITE_FIREBASE_API_KEY` **Value**: Your Firebase API key
- **Name**: `VITE_FIREBASE_AUTH_DOMAIN` **Value**: `your-project-id.firebaseapp.com`
- **Name**: `VITE_FIREBASE_PROJECT_ID` **Value**: Your Firebase project ID
- **Name**: `VITE_FIREBASE_STORAGE_BUCKET` **Value**: `your-project-id.firebasestorage.app`
- **Name**: `VITE_FIREBASE_MESSAGING_SENDER_ID` **Value**: Your messaging sender ID
- **Name**: `VITE_FIREBASE_APP_ID` **Value**: Your Firebase app ID

**📝 Get these values from**: Firebase Console > Project Settings > General > Your apps

### 4. Enable GitHub Pages
1. Go to **Settings** > **Pages**
2. Under **Source**, select **GitHub Actions**
3. The deployment will start automatically

### 5. Configure Firebase Security Rules
In your Firebase Console:
1. Go to **Firestore Database** > **Rules**
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access for the waste management app
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ Security Note**: These rules allow full access. For production, implement proper authentication.

### 6. Initialize Firebase Data
After deployment:
1. Visit your deployed app: `https://YOUR_USERNAME.github.io/ecotrack-waste-management/`
2. Login as admin (username: `admin`, password: `password123`)
3. The system will automatically initialize with sample data

## 🔧 Troubleshooting

### Build Fails
- ✅ Check all Firebase secrets are set correctly
- ✅ Verify Firebase project is active
- ✅ Check GitHub Actions logs for specific errors

### App Doesn't Load
- ✅ Ensure repository is public
- ✅ Check that GitHub Pages is enabled
- ✅ Verify the base path in `vite.config.ts` matches your repo name

### Firebase Connection Issues
- ✅ Verify all secrets match your Firebase config exactly
- ✅ Check Firebase project is not paused
- ✅ Ensure Firestore is enabled in Firebase Console

### Data Not Loading
- ✅ Check Firebase security rules
- ✅ Verify Firestore is enabled
- ✅ Check browser console for errors

## 📱 Your Deployed App

Once deployed, your app will be available at:
```
https://YOUR_USERNAME.github.io/ecotrack-waste-management/
```

## 🔐 Default Login Credentials

- **Admin**: username: `admin`, password: `password123`
- **Collector**: username: `mike`, password: `password123`
- **Collector**: username: `carlos`, password: `password123`

## 🎯 Next Steps

1. **Customize**: Update the sample data with your actual households and locations
2. **Security**: Implement proper Firebase security rules for production
3. **Domain**: Set up a custom domain if needed
4. **Monitoring**: Set up Firebase monitoring and alerts

## 📞 Support

If you encounter issues:
1. Check the GitHub Actions tab for build logs
2. Verify all secrets are correctly set
3. Check Firebase Console for database issues
4. Review the browser console for client-side errors

## 🔄 Updating Your App

To update your deployed app:
1. Make changes to your code
2. Commit and push to the main branch
3. GitHub Actions will automatically rebuild and redeploy
4. Your changes will be live in a few minutes
