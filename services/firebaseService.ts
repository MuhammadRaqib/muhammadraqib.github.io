import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Household, User, AreaLocation, CollectionRecord, Role, PendingDate } from '../types';

// Collection names
const COLLECTIONS = {
  HOUSEHOLDS: 'households',
  USERS: 'users',
  LOCATIONS: 'locations',
  COLLECTION_RECORDS: 'collectionRecords',
  PENDING_DATES: 'pendingDates'
} as const;

// Household operations
export const householdService = {
  // Get all households
  async getAll(): Promise<Household[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.HOUSEHOLDS));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Household));
    } catch (error) {
      console.error('Error getting households:', error);
      throw error;
    }
  },

  // Add a new household
  async add(household: Omit<Household, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.HOUSEHOLDS), household);
      return docRef.id;
    } catch (error) {
      console.error('Error adding household:', error);
      throw error;
    }
  },

  // Update a household
  async update(id: string, updates: Partial<Household>): Promise<void> {
    try {
      const householdRef = doc(db, COLLECTIONS.HOUSEHOLDS, id);
      await updateDoc(householdRef, updates);
    } catch (error) {
      console.error('Error updating household:', error);
      throw error;
    }
  },

  // Delete a household
  async delete(id: string): Promise<void> {
    try {
      const householdRef = doc(db, COLLECTIONS.HOUSEHOLDS, id);
      await deleteDoc(householdRef);
    } catch (error) {
      console.error('Error deleting household:', error);
      throw error;
    }
  },

  // Get households by status
  async getByStatus(status: 'Pending' | 'Collected'): Promise<Household[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.HOUSEHOLDS),
        where('status', '==', status)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Household));
    } catch (error) {
      console.error('Error getting households by status:', error);
      throw error;
    }
  }
};

// User operations
export const userService = {
  // Get all users
  async getAll(): Promise<User[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  },

  // Add a new user
  async add(user: Omit<User, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.USERS), user);
      return docRef.id;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  },

  // Update a user
  async update(id: string, updates: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, id);
      await updateDoc(userRef, updates);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete a user
  async delete(id: string): Promise<void> {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, id);
      await deleteDoc(userRef);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Get user by username
  async getByUsername(username: string): Promise<User | null> {
    try {
      const q = query(
        collection(db, COLLECTIONS.USERS),
        where('username', '==', username)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as User;
    } catch (error) {
      console.error('Error getting user by username:', error);
      throw error;
    }
  }
};

// Location operations
export const locationService = {
  // Get all locations
  async getAll(): Promise<AreaLocation[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.LOCATIONS));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AreaLocation));
    } catch (error) {
      console.error('Error getting locations:', error);
      throw error;
    }
  },

  // Add a new location
  async add(location: Omit<AreaLocation, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.LOCATIONS), location);
      return docRef.id;
    } catch (error) {
      console.error('Error adding location:', error);
      throw error;
    }
  },

  // Update a location
  async update(id: string, updates: Partial<AreaLocation>): Promise<void> {
    try {
      const locationRef = doc(db, COLLECTIONS.LOCATIONS, id);
      await updateDoc(locationRef, updates);
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  },

  // Delete a location
  async delete(id: string): Promise<void> {
    try {
      const locationRef = doc(db, COLLECTIONS.LOCATIONS, id);
      await deleteDoc(locationRef);
    } catch (error) {
      console.error('Error deleting location:', error);
      throw error;
    }
  }
};

// Collection record operations
export const collectionRecordService = {
  // Get all collection records
  async getAll(): Promise<CollectionRecord[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.COLLECTION_RECORDS));
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          householdId: data.householdId,
          collectorId: data.collectorId,
          timestamp: data.timestamp.toDate(),
          location: data.location
        } as CollectionRecord;
      });
    } catch (error) {
      console.error('Error getting collection records:', error);
      throw error;
    }
  },

  // Add a new collection record
  async add(record: Omit<CollectionRecord, 'id'>): Promise<string> {
    try {
      const recordData = {
        ...record,
        timestamp: Timestamp.fromDate(record.timestamp)
      };
      const docRef = await addDoc(collection(db, COLLECTIONS.COLLECTION_RECORDS), recordData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding collection record:', error);
      throw error;
    }
  },

  // Get collection records by household
  async getByHousehold(householdId: string): Promise<CollectionRecord[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.COLLECTION_RECORDS),
        where('householdId', '==', householdId),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          householdId: data.householdId,
          collectorId: data.collectorId,
          timestamp: data.timestamp.toDate(),
          location: data.location
        } as CollectionRecord;
      });
    } catch (error) {
      console.error('Error getting collection records by household:', error);
      throw error;
    }
  },

  // Get collection records by collector
  async getByCollector(collectorId: string): Promise<CollectionRecord[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.COLLECTION_RECORDS),
        where('collectorId', '==', collectorId),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          householdId: data.householdId,
          collectorId: data.collectorId,
          timestamp: data.timestamp.toDate(),
          location: data.location
        } as CollectionRecord;
      });
    } catch (error) {
      console.error('Error getting collection records by collector:', error);
      throw error;
    }
  },

  // Get recent collection records
  async getRecent(limit: number = 10): Promise<CollectionRecord[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.COLLECTION_RECORDS),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.slice(0, limit).map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          householdId: data.householdId,
          collectorId: data.collectorId,
          timestamp: data.timestamp.toDate(),
          location: data.location
        } as CollectionRecord;
      });
    } catch (error) {
      console.error('Error getting recent collection records:', error);
      throw error;
    }
  }
};

// Pending dates operations
export const pendingDateService = {
  // Get all pending dates
  async getAll(): Promise<PendingDate[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.PENDING_DATES));
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          householdId: data.householdId,
          date: data.date,
          reason: data.reason,
          createdAt: data.createdAt.toDate()
        } as PendingDate;
      });
    } catch (error) {
      console.error('Error getting pending dates:', error);
      throw error;
    }
  },

  // Add a new pending date
  async add(pendingDate: Omit<PendingDate, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.PENDING_DATES), {
        ...pendingDate,
        createdAt: Timestamp.fromDate(pendingDate.createdAt)
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding pending date:', error);
      throw error;
    }
  },

  // Delete a pending date
  async delete(id: string): Promise<void> {
    try {
      const pendingDateRef = doc(db, COLLECTIONS.PENDING_DATES, id);
      await deleteDoc(pendingDateRef);
    } catch (error) {
      console.error('Error deleting pending date:', error);
      throw error;
    }
  },

  // Get pending dates for a specific household
  async getByHousehold(householdId: string): Promise<PendingDate[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.PENDING_DATES),
        where('householdId', '==', householdId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          householdId: data.householdId,
          date: data.date,
          reason: data.reason,
          createdAt: data.createdAt.toDate()
        } as PendingDate;
      });
    } catch (error) {
      console.error('Error getting pending dates for household:', error);
      throw error;
    }
  }
};

