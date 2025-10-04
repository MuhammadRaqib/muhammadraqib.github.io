import { useState, useEffect, useCallback } from 'react';
import { 
  householdService, 
  userService, 
  locationService, 
  collectionRecordService,
  pendingDateService 
} from '../services/firebaseService';
import { Household, User, AreaLocation, CollectionRecord, LocationCoords, PendingDate } from '../types';

export const useFirebase = () => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [locations, setLocations] = useState<AreaLocation[]>([]);
  const [collectionRecords, setCollectionRecords] = useState<CollectionRecord[]>([]);
  const [pendingDates, setPendingDates] = useState<PendingDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [householdsData, usersData, locationsData, recordsData, pendingDatesData] = await Promise.all([
        householdService.getAll(),
        userService.getAll(),
        locationService.getAll(),
        collectionRecordService.getAll(),
        pendingDateService.getAll()
      ]);

      setHouseholds(householdsData);
      setUsers(usersData);
      setLocations(locationsData);
      setCollectionRecords(recordsData);
      setPendingDates(pendingDatesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Household operations
  const addHousehold = useCallback(async (household: Omit<Household, 'id'>) => {
    try {
      const id = await householdService.add(household);
      const newHousehold = { ...household, id };
      setHouseholds(prev => [...prev, newHousehold]);
      return id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add household');
      throw err;
    }
  }, []);

  const updateHousehold = useCallback(async (id: string, updates: Partial<Household>) => {
    try {
      await householdService.update(id, updates);
      setHouseholds(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update household');
      throw err;
    }
  }, []);

  const deleteHousehold = useCallback(async (id: string) => {
    try {
      await householdService.delete(id);
      setHouseholds(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete household');
      throw err;
    }
  }, []);

  // User operations
  const addUser = useCallback(async (user: Omit<User, 'id'>) => {
    try {
      const id = await userService.add(user);
      const newUser = { ...user, id };
      setUsers(prev => [...prev, newUser]);
      return id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add user');
      throw err;
    }
  }, []);

  const updateUser = useCallback(async (id: string, updates: Partial<User>) => {
    try {
      await userService.update(id, updates);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      throw err;
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    try {
      await userService.delete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      throw err;
    }
  }, []);

  // Location operations
  const addLocation = useCallback(async (location: Omit<AreaLocation, 'id'>) => {
    try {
      const id = await locationService.add(location);
      const newLocation = { ...location, id };
      setLocations(prev => [...prev, newLocation]);
      return id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add location');
      throw err;
    }
  }, []);

  const updateLocation = useCallback(async (id: string, updates: Partial<AreaLocation>) => {
    try {
      await locationService.update(id, updates);
      setLocations(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update location');
      throw err;
    }
  }, []);

  const deleteLocation = useCallback(async (id: string) => {
    try {
      await locationService.delete(id);
      setLocations(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete location');
      throw err;
    }
  }, []);

  // Collection record operations
  const addCollectionRecord = useCallback(async (record: Omit<CollectionRecord, 'id'>) => {
    try {
      const id = await collectionRecordService.add(record);
      const newRecord = { ...record, id };
      setCollectionRecords(prev => [...prev, newRecord]);
      return id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add collection record');
      throw err;
    }
  }, []);

  const markAsCollected = useCallback(async (householdId: string, collectorId: string, location: LocationCoords | null) => {
    try {
      // Update household status
      await updateHousehold(householdId, { status: 'Collected' });
      
      // Add collection record
      const record: Omit<CollectionRecord, 'id'> = {
        householdId,
        collectorId,
        timestamp: new Date(),
        location
      };
      await addCollectionRecord(record);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as collected');
      throw err;
    }
  }, [updateHousehold, addCollectionRecord]);

  const resetCollections = useCallback(async () => {
    try {
      // Update all households to pending status
      const updatePromises = households.map(household => 
        updateHousehold(household.id, { status: 'Pending' })
      );
      await Promise.all(updatePromises);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset collections');
      throw err;
    }
  }, [households, updateHousehold]);

  // Authentication
  const authenticateUser = useCallback(async (username: string, password: string): Promise<User | null> => {
    try {
      const user = await userService.getByUsername(username);
      if (user && user.password === password) {
        return user;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      return null;
    }
  }, []);

  // Pending dates operations
  const addPendingDate = useCallback(async (pendingDate: Omit<PendingDate, 'id'>) => {
    try {
      const id = await pendingDateService.add(pendingDate);
      const newPendingDate = { ...pendingDate, id };
      setPendingDates(prev => [...prev, newPendingDate]);
      return id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add pending date');
      throw err;
    }
  }, []);

  const deletePendingDate = useCallback(async (id: string) => {
    try {
      await pendingDateService.delete(id);
      setPendingDates(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete pending date');
      throw err;
    }
  }, []);

  // Auto reset functionality - check if it's a new day and reset collections
  const checkAndResetDaily = useCallback(async () => {
    try {
      const today = new Date().toDateString();
      const lastReset = localStorage.getItem('lastResetDate');
      
      if (lastReset !== today) {
        // It's a new day, reset all collections
        const updatePromises = households.map(household => 
          updateHousehold(household.id, { status: 'Pending' })
        );
        await Promise.all(updatePromises);
        localStorage.setItem('lastResetDate', today);
        console.log('Daily reset completed automatically');
      }
    } catch (err) {
      console.error('Error in daily reset:', err);
    }
  }, [households, updateHousehold]);

  // Check for daily reset on component mount
  useEffect(() => {
    checkAndResetDaily();
  }, [checkAndResetDaily]);

  return {
    // Data
    households,
    users,
    locations,
    collectionRecords,
    pendingDates,
    loading,
    error,
    
    // Household operations
    addHousehold,
    updateHousehold,
    deleteHousehold,
    
    // User operations
    addUser,
    updateUser,
    deleteUser,
    
    // Location operations
    addLocation,
    updateLocation,
    deleteLocation,
    
    // Collection operations
    addCollectionRecord,
    markAsCollected,
    resetCollections,
    
    // Pending dates operations
    addPendingDate,
    deletePendingDate,
    
    // Authentication
    authenticateUser,
    
    // Utility
    loadAllData
  };
};

