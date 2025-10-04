# EcoTrack Deployment Guide

This guide will help you deploy the EcoTrack waste management application to GitHub Pages.

## Prerequisites

1. A GitHub account
2. A Firebase project set up
3. Node.js and npm installed locally

## Step 1: Set up Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Firestore Database
4. Get your Firebase configuration from Project Settings > General > Your apps

## Step 2: Set up GitHub Repository

1. Create a new repository on GitHub
2. Push your code to the repository
3. Go to repository Settings > Pages
4. Set source to "GitHub Actions"

## Step 3: Configure GitHub Secrets

In your GitHub repository, go to Settings > Secrets and variables > Actions, and add these secrets:

### Required Secrets:
- `VITE_FIREBASE_API_KEY` - Your Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Your Firebase auth domain (e.g., project-id.firebaseapp.com)
- `VITE_FIREBASE_PROJECT_ID` - Your Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Your Firebase storage bucket (e.g., project-id.firebasestorage.app)
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Your Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID` - Your Firebase app ID

### Optional Secrets:
- `GEMINI_API_KEY` - If you plan to use AI features

## Step 4: Firebase Security Rules

Update your Firestore security rules to allow public read access for the application:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all collections for the waste management app
    match /{document=**} {
      allow read, write: if true; // For development - restrict in production
    }
  }
}
```

**⚠️ Security Note:** The above rules allow full access. For production, implement proper authentication rules.

## Step 5: Initialize Firebase Data

1. Run the Firebase initialization script locally:
   ```bash
   npm run dev
   ```
2. Login as admin and navigate to the admin panel
3. The system will automatically initialize with sample data

## Step 6: Deploy

1. Push your code to the main/master branch
2. GitHub Actions will automatically build and deploy to GitHub Pages
3. Your app will be available at: `https://yourusername.github.io/ecotrack-waste-management/`

## Step 7: Configure Custom Domain (Optional)

1. In your repository Settings > Pages
2. Add your custom domain
3. Update the `base` path in `vite.config.ts` if needed

## Local Development

1. Copy `env.example` to `.env.local`
2. Fill in your Firebase configuration
3. Run `npm run dev`

## Troubleshooting

### Build Fails
- Check that all required secrets are set in GitHub
- Verify Firebase configuration is correct
- Check the Actions tab for detailed error logs

### App Doesn't Load
- Verify the base path in `vite.config.ts` matches your repository name
- Check that GitHub Pages is enabled
- Ensure Firebase rules allow public access

### Firebase Connection Issues
- Verify all Firebase secrets are correctly set
- Check that your Firebase project is active
- Ensure Firestore is enabled in your Firebase project

## Security Considerations

1. **Firebase Rules**: Implement proper security rules for production
2. **API Keys**: Never commit API keys to the repository
3. **Authentication**: Consider implementing proper user authentication
4. **Data Validation**: Add server-side validation for data integrity

## Support

If you encounter issues:
1. Check the GitHub Actions logs
2. Verify Firebase configuration
3. Ensure all secrets are properly set
4. Check the browser console for client-side errors
