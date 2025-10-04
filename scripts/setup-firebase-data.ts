import { initializeFirebase } from './initializeFirebase';

/**
 * Setup script to initialize Firebase with sample data
 * Run this after deploying to ensure the database has initial data
 */
const setupFirebaseData = async () => {
  try {
    console.log('🚀 Setting up Firebase with sample data...');
    await initializeFirebase();
    console.log('✅ Firebase setup completed successfully!');
    console.log('📝 You can now login with:');
    console.log('   - Username: admin, Password: password123 (Admin)');
    console.log('   - Username: mike, Password: password123 (Collector)');
    console.log('   - Username: carlos, Password: password123 (Collector)');
  } catch (error) {
    console.error('❌ Error setting up Firebase:', error);
    process.exit(1);
  }
};

// Run the setup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupFirebaseData();
}

export { setupFirebaseData };
