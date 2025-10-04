# EcoTrack Waste Management System

A comprehensive waste collection management system built with React, TypeScript, and Firebase. Track household waste collection schedules, manage collectors, and monitor collection status with an intuitive calendar interface.

## Features

- 🏠 **Household Management**: Add, edit, and track household information
- 👥 **User Management**: Admin and collector role-based access
- 📍 **Location Management**: Organize households by blocks and panchayats
- 📅 **Calendar Integration**: Visual calendar with collection history and pending dates
- 🔄 **Automatic Daily Reset**: Collections automatically reset to pending each day
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔐 **Firebase Integration**: Real-time data synchronization

## Quick Start

### Prerequisites
- Node.js 20+ (required for Firebase v12+)
- Firebase project
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ecotrack-waste-management.git
   cd ecotrack-waste-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   Edit `.env.local` with your Firebase configuration.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Deployment

### GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

**Quick Setup:**
1. Push code to GitHub repository
2. Set up Firebase secrets in GitHub repository settings
3. Enable GitHub Pages with GitHub Actions
4. Your app will be automatically deployed to `https://muhammadraqib.github.io/ecotrack-waste-management/`

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service

## Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Firestore Database
3. Set up security rules (see DEPLOYMENT.md)
4. Get your configuration from Project Settings

### Environment Variables
**🔐 Security Note**: Never commit Firebase keys to your repository. Always use environment variables.

Copy `env.example` to `.env.local` and configure:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Get these values from**: Firebase Console > Project Settings > General > Your apps

## Usage

### Admin Features
- Manage households, users, and locations
- View collection calendar with pending dates
- Automatic daily reset functionality
- System-wide collection status management

### Collector Features
- Mark collections as completed
- View assigned households
- Track collection history

### Calendar Features
- Visual calendar showing collection status
- Mark specific dates as pending
- View collection history and details
- Color-coded status indicators

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Deployment**: GitHub Pages, GitHub Actions
- **Icons**: Custom SVG components

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues and questions:
1. Check the [DEPLOYMENT.md](DEPLOYMENT.md) guide
2. Review GitHub Actions logs
3. Check Firebase console for data issues
4. Open an issue on GitHub
