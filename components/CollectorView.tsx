import React, { useState, useMemo } from 'react';
import { Household, LocationCoords, User } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { MapPinIcon } from './icons/MapPinIcon';

interface CollectorViewProps {
  households: Household[];
  onMarkAsCollected: (householdId: number, location: LocationCoords | null) => void;
  currentUser: User;
}

const CollectorView: React.FC<CollectorViewProps> = ({ households, onMarkAsCollected, currentUser }) => {
  const [loadingLocation, setLoadingLocation] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCollect = (householdId: number) => {
    setLoadingLocation(householdId);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      onMarkAsCollected(householdId, null);
      setLoadingLocation(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: LocationCoords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        onMarkAsCollected(householdId, location);
        setLoadingLocation(null);
      },
      (error: GeolocationPositionError) => {
        console.error("Geolocation error:", error.message);
        
        let alertMessage = "Could not get your location. ";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            alertMessage += "You denied the request for Geolocation.";
            break;
          case error.POSITION_UNAVAILABLE:
            alertMessage += "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            alertMessage += "The request to get user location timed out.";
            break;
          default:
            alertMessage += "An unknown error occurred.";
            break;
        }
        
        alert(`${alertMessage} Collection will be marked without coordinates.`);
        onMarkAsCollected(householdId, null);
        setLoadingLocation(null);
      }
    );
  };
  
  const pendingHouseholdsCount = households.filter(h => h.status === 'Pending').length;

  const filteredHouseholds = useMemo(() => {
    if (!searchQuery) {
      return households;
    }
    return households.filter(h =>
      h.houseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.block.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.panchayat.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, households]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Collector View</h2>
        <p className="text-lg text-gray-600 mt-2">Welcome, <span className="font-semibold text-green-700">{currentUser.username}</span>!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-500">Pending Collections</h3>
            <p className="mt-3 text-4xl font-bold text-amber-500">{pendingHouseholdsCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-center">
            <label htmlFor="search-household" className="text-sm font-medium text-gray-700 mb-1">Search Household</label>
            <input
              id="search-household"
              type="text"
              placeholder="Search by house, owner, block..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
        </div>
      </div>
      
      <div className="space-y-6">
        {filteredHouseholds.length > 0 ? (
          filteredHouseholds.map((household) => (
            <div key={household.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <p className="font-bold text-lg text-gray-800">{household.houseNumber}</p>
                <p className="text-gray-600 font-medium">{household.block}, {household.panchayat}</p>
                <p className="text-gray-600">{household.address}</p>
                <p className="text-sm text-gray-500">Owner: {household.ownerName}</p>
              </div>
              <div>
                {household.status === 'Pending' ? (
                  <button
                    onClick={() => handleCollect(household.id)}
                    disabled={loadingLocation === household.id}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loadingLocation === household.id ? (
                      <>
                        <MapPinIcon className="animate-pulse w-5 h-5" />
                        <span>Fetching Location...</span>
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="w-5 h-5" />
                        <span>Mark as Collected</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 text-green-700 bg-green-100 rounded-lg">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span className="font-semibold">Collected</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-500">No households found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectorView;