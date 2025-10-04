import React, { useState, useCallback } from 'react';
import { View, Household, CollectionRecord, LocationCoords, User, Role, AreaLocation } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import CollectorView from './components/CollectorView';
import Login from './components/Login';
import { useFirebase } from './hooks/useFirebase';
import { initializeFirebase } from './scripts/initializeFirebase';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const [showLogin, setShowLogin] = useState<boolean>(false);

  // Use Firebase hook for data management
  const {
    households,
    users,
    locations,
    collectionRecords,
    pendingDates,
    loading,
    error,
    addHousehold,
    updateHousehold,
    deleteHousehold,
    addUser,
    updateUser,
    deleteUser,
    addLocation,
    updateLocation,
    deleteLocation,
    markAsCollected,
    resetCollections,
    addPendingDate,
    deletePendingDate,
    authenticateUser,
    loadAllData
  } = useFirebase();

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      // initializeFirebase();
      const user = await authenticateUser(username, password);
      if (user) {
        setCurrentUser(user);
        setShowLogin(false);
        if (user.role === Role.Collector) {
          setCurrentView(View.Collector);
        } else {
          setCurrentView(View.Dashboard);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView(View.Dashboard);
  };

  const handleMarkAsCollected = useCallback(async (householdId: string, location: LocationCoords | null) => {
    if (!currentUser) return;
    try {
      await markAsCollected(householdId, currentUser.id, location);
    } catch (err) {
      console.error('Error marking as collected:', err);
    }
  }, [currentUser, markAsCollected]);
  
  
  const handleDeleteUser = async (userId: string) => {
    if (currentUser?.id.toString() === userId) {
      alert("You cannot delete your own account.");
      return;
    }
    try {
      await deleteUser(userId);
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user. Please try again.');
    }
  };

  const handleUpdateHousehold = async (updatedHousehold: Household) => {
    try {
      await updateHousehold(updatedHousehold.id, updatedHousehold);
    } catch (err) {
      console.error('Error updating household:', err);
      alert('Failed to update household. Please try again.');
    }
  };

  const handleDeleteHousehold = async (householdId: string) => {
    try {
      await deleteHousehold(householdId);
    } catch (err) {
      console.error('Error deleting household:', err);
      alert('Failed to delete household. Please try again.');
    }
  };

  const renderView = () => {
    // Public view or logged-in user viewing dashboard
    if (currentView === View.Dashboard) {
      return <Dashboard households={households} collectionRecords={collectionRecords} />;
    }
    
    // Protected views
    if (currentUser?.role === Role.Admin && currentView === View.Admin) {
      return <AdminPanel 
                households={households} 
                users={users} 
                locations={locations}
                collectionRecords={collectionRecords}
                pendingDates={pendingDates}
                handleDeleteUser={handleDeleteUser}
                currentUser={currentUser}
                handleUpdateHousehold={handleUpdateHousehold}
                handleDeleteHousehold={handleDeleteHousehold}
                addLocation={addLocation}
                updateLocation={updateLocation}
                deleteLocation={deleteLocation}
                addUser={addUser}
                updateUser={updateUser}
                addHousehold={addHousehold}
                updateHousehold={updateHousehold}
                addPendingDate={addPendingDate}
                deletePendingDate={deletePendingDate}
              />;
    }

    if (currentUser?.role === Role.Collector && currentView === View.Collector) {
      return <CollectorView households={households} onMarkAsCollected={handleMarkAsCollected} currentUser={currentUser} />;
    }
    
    // Fallback to dashboard if trying to access protected route without correct role
    return <Dashboard households={households} collectionRecords={collectionRecords} />;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading EcoTrack...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadAllData}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header 
        currentUser={currentUser} 
        onLogout={handleLogout}
        currentView={currentView} 
        setCurrentView={setCurrentView}
        onLoginClick={() => setShowLogin(true)} 
      />
      <main className="px-4 sm:px-6 lg:px-12 xl:px-16 py-6 sm:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto">
          {showLogin ? <Login onLogin={handleLogin} /> : renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
