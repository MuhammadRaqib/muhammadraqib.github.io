# Firebase Setup for EcoTrack

This guide will help you set up Firebase for the EcoTrack waste management application.

## Prerequisites

1. A Google account
2. Node.js and npm installed
3. The EcoTrack application set up

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `ecotrack-waste-management` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Firestore Database

1. In your Firebase project, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database (choose the closest to your users)
5. Click "Done"

## Step 3: Get Firebase Configuration

1. In your Firebase project, go to "Project Settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Web app" icon (`</>`)
4. Enter app nickname: `ecotrack-web`
5. Check "Also set up Firebase Hosting" (optional)
6. Click "Register app"
7. Copy the Firebase configuration object

## Step 4: Update Firebase Configuration

1. Open `firebase.ts` in your project
2. Replace the placeholder configuration with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id"
};
```

## Step 5: Set Up Firestore Security Rules (Optional)

For development, you can use these basic rules. **For production, implement proper authentication and authorization rules.**

1. Go to "Firestore Database" → "Rules"
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents for development
    // WARNING: This is not secure for production!
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click "Publish"

## Step 6: Initialize Sample Data (Optional)

If you want to populate your database with sample data, you can run the initialization script:

1. Make sure your Firebase configuration is set up correctly
2. The application will automatically create sample data on first run
3. You can also manually run the initialization script if needed

## Step 7: Test the Application

1. Start your development server: `npm run dev`
2. Open the application in your browser
3. Try logging in with the sample credentials:
   - Admin: `admin` / `password123`
   - Collector: `mike` / `password123`
   - Collector: `carlos` / `password123`

## Firestore Collections Structure

The application uses the following Firestore collections:

### `households`
- `id`: string (auto-generated)
- `houseNumber`: string
- `address`: string
- `ownerName`: string
- `block`: string
- `panchayat`: string
- `status`: 'Pending' | 'Collected'

### `users`
- `id`: string (auto-generated)
- `username`: string
- `password`: string (in production, use Firebase Auth)
- `role`: 'admin' | 'collector'

### `locations`
- `id`: string (auto-generated)
- `blockName`: string
- `panchayats`: string[]

### `collectionRecords`
- `id`: string (auto-generated)
- `householdId`: string
- `collectorId`: string
- `timestamp`: Timestamp
- `location`: { latitude: number, longitude: number } | null

## Production Considerations

1. **Authentication**: Implement Firebase Authentication instead of storing passwords
2. **Security Rules**: Create proper Firestore security rules based on user roles
3. **Data Validation**: Add server-side validation using Cloud Functions
4. **Backup**: Set up automated backups
5. **Monitoring**: Enable Firebase Performance Monitoring and Crashlytics

## Troubleshooting

### Common Issues

1. **Firebase not initialized**: Check your configuration in `firebase.ts`
2. **Permission denied**: Check your Firestore security rules
3. **Network errors**: Ensure your Firebase project is active and billing is set up if needed
4. **Data not loading**: Check the browser console for errors

### Debug Mode

To enable debug logging, add this to your browser console:
```javascript
localStorage.setItem('firebase:debug', '*');
```

## Support

If you encounter issues:
1. Check the Firebase Console for error logs
2. Review the browser console for client-side errors
3. Ensure all dependencies are installed: `npm install`
4. Verify your Firebase configuration is correct

