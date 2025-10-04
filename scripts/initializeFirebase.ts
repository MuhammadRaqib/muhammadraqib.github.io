import { 
  householdService, 
  userService, 
  locationService, 
  collectionRecordService 
} from '../services/firebaseService';
import { Role } from '../types';

// Sample data to initialize Firebase
const sampleUsers = [
  { username: 'admin', password: 'password123', role: Role.Admin },
  { username: 'mike', password: 'password123', role: Role.Collector },
  { username: 'carlos', password: 'password123', role: Role.Collector },
];

const sampleLocations = [
  { blockName: 'A', panchayats: ['Greenwood'] },
  { blockName: 'B', panchayats: ['Sunvalley'] },
  { blockName: 'C', panchayats: ['Oceanfront'] },
  { blockName: 'D', panchayats: ['Pineville'] },
];

const sampleHouseholds = [
  { houseNumber: 'A-101', address: 'Green Valley, Sector 5', ownerName: 'John Doe', block: 'A', panchayat: 'Greenwood', status: 'Pending' as const },
  { houseNumber: 'B-204', address: 'Sunrise Apartments, Block B', ownerName: 'Jane Smith', block: 'B', panchayat: 'Sunvalley', status: 'Pending' as const },
  { houseNumber: 'C-308', address: 'Ocean View Residency', ownerName: 'Peter Jones', block: 'C', panchayat: 'Oceanfront', status: 'Collected' as const },
  { houseNumber: 'D-112', address: 'Maple Street, 45', ownerName: 'Mary Williams', block: 'A', panchayat: 'Greenwood', status: 'Pending' as const },
  { houseNumber: 'E-501', address: 'Pinecrest Towers', ownerName: 'David Brown', block: 'D', panchayat: 'Pineville', status: 'Collected' as const },
];

const sampleCollectionRecords = [
  { householdId: '', collectorId: '', timestamp: new Date(Date.now() - 86400000), location: { latitude: 28.6139, longitude: 77.2090 } },
  { householdId: '', collectorId: '', timestamp: new Date(Date.now() - 172800000), location: { latitude: 19.0760, longitude: 72.8777 } },
  { householdId: '', collectorId: '', timestamp: new Date(), location: { latitude: 28.6139, longitude: 77.2090 } },
];

export const initializeFirebase = async () => {
  try {
    console.log('Initializing Firebase with sample data...');

    // Add users
    const userIds: string[] = [];
    for (const user of sampleUsers) {
      const id = await userService.add(user);
      userIds.push(id);
      console.log(`Added user: ${user.username} (${id})`);
    }

    // Add locations
    const locationIds: string[] = [];
    for (const location of sampleLocations) {
      const id = await locationService.add(location);
      locationIds.push(id);
      console.log(`Added location: ${location.blockName} (${id})`);
    }

    // Add households
    const householdIds: string[] = [];
    for (const household of sampleHouseholds) {
      const id = await householdService.add(household);
      householdIds.push(id);
      console.log(`Added household: ${household.houseNumber} (${id})`);
    }

    // Add collection records (using the first collector and some households)
    const collectorId = userIds[1]; // mike
    const householdIdsForRecords = [householdIds[2], householdIds[4], householdIds[2]]; // C-308, E-501, C-308
    
    for (let i = 0; i < sampleCollectionRecords.length; i++) {
      const record = {
        ...sampleCollectionRecords[i],
        householdId: householdIdsForRecords[i],
        collectorId: collectorId
      };
      const id = await collectionRecordService.add(record);
      console.log(`Added collection record: ${id}`);
    }

    console.log('Firebase initialization completed successfully!');
    console.log('You can now use the application with the following credentials:');
    console.log('Admin: admin / password123');
    console.log('Collector: mike / password123');
    console.log('Collector: carlos / password123');

  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
};

// Run initialization if this script is executed directly
if (typeof window === 'undefined') {
  initializeFirebase().catch(console.error);
}

