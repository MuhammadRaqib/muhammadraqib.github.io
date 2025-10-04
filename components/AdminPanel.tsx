import React, { useState, useMemo, useEffect } from 'react';
import { Household, User, Role, CollectionRecord, AreaLocation, PendingDate } from '../types';
import { HomeIcon } from './icons/HomeIcon';
import { UserIcon } from './icons/UserIcon';
import { AdminIcon } from './icons/AdminIcon';
import { DeleteIcon } from './icons/DeleteIcon';
import { EditIcon } from './icons/EditIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { LocationIcon } from './icons/LocationIcon';
import ConfirmModal from './ConfirmModal';
import EditHouseholdModal from './EditHouseholdModal';
import CalendarModal from './CalendarModal';

interface AdminPanelProps {
  households: Household[];
  users: User[];
  locations: AreaLocation[];
  collectionRecords: CollectionRecord[];
  pendingDates: PendingDate[];
  handleDeleteUser: (userId: string) => void;
  currentUser: User;
  handleUpdateHousehold: (household: Household) => void;
  handleDeleteHousehold: (householdId: string) => void;
  addLocation: (location: Omit<AreaLocation, 'id'>) => Promise<string>;
  updateLocation: (id: string, updates: Partial<AreaLocation>) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<string>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  addHousehold: (household: Omit<Household, 'id'>) => Promise<string>;
  updateHousehold: (id: string, updates: Partial<Household>) => Promise<void>;
  addPendingDate: (pendingDate: Omit<PendingDate, 'id'>) => Promise<string>;
  deletePendingDate: (id: string) => Promise<void>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  households, users, locations, collectionRecords, pendingDates, handleDeleteUser, currentUser, handleUpdateHousehold, handleDeleteHousehold, addLocation, updateLocation, deleteLocation, addUser, updateUser, addHousehold, updateHousehold, addPendingDate, deletePendingDate
}) => {
  // Add Household State
  const [houseNumber, setHouseNumber] = useState('');
  const [address, setAddress] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [selectedPanchayat, setSelectedPanchayat] = useState('');
  const [availablePanchayats, setAvailablePanchayats] = useState<string[]>([]);
  
  // Add User State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(Role.Collector);
  
  // Location Management State
  const [newBlockName, setNewBlockName] = useState('');
  const [newPanchayatName, setNewPanchayatName] = useState<Record<number, string>>({});

  // Household Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Modals State
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);

  const [householdToEdit, setHouseholdToEdit] = useState<Household | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [householdToViewCalendar, setHouseholdToViewCalendar] = useState<Household | null>(null);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  const [householdToDelete, setHouseholdToDelete] = useState<Household | null>(null);
  const [isDeleteHouseholdModalOpen, setIsDeleteHouseholdModalOpen] = useState(false);

  // Effect to update panchayats when a block is selected
  useEffect(() => {
    if (selectedBlock) {
      const location = locations.find(l => l.blockName === selectedBlock);
      setAvailablePanchayats(location ? location.panchayats : []);
      setSelectedPanchayat(''); // Reset panchayat selection
    } else {
      setAvailablePanchayats([]);
    }
  }, [selectedBlock, locations]);

  const handleAddHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!houseNumber || !address || !ownerName || !selectedBlock || !selectedPanchayat) return;
    
    try {
      const newHousehold: Omit<Household, 'id'> = {
        houseNumber,
        address,
        ownerName,
        block: selectedBlock,
        panchayat: selectedPanchayat,
        status: 'Pending',
      };
      await addHousehold(newHousehold);
      setHouseNumber('');
      setAddress('');
      setOwnerName('');
      setSelectedBlock('');
      setSelectedPanchayat('');
    } catch (err) {
      console.error('Error adding household:', err);
      alert('Failed to add household. Please try again.');
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    
    try {
      const newUser: Omit<User, 'id'> = {
        username,
        password, // In a real app, this would be hashed
        role,
      };
      await addUser(newUser);
      setUsername('');
      setPassword('');
      setRole(Role.Collector);
    } catch (err) {
      console.error('Error adding user:', err);
      alert('Failed to add user. Please try again.');
    }
  };
  
  // Location Management Logic
  const handleAddBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockName.trim() || locations.some(l => l.blockName.toLowerCase() === newBlockName.trim().toLowerCase())) {
        alert("Block name cannot be empty or a duplicate.");
        return;
    }
    try {
      const newBlock: Omit<AreaLocation, 'id'> = {
        blockName: newBlockName.trim(),
        panchayats: [],
      };
      await addLocation(newBlock);
      setNewBlockName('');
    } catch (err) {
      console.error('Error adding block:', err);
      alert('Failed to add block. Please try again.');
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (households.some(h => locations.find(l => l.id === blockId)?.blockName === h.block)) {
        alert("Cannot delete a block that is currently assigned to a household.");
        return;
    }
    try {
      await deleteLocation(blockId);
    } catch (err) {
      console.error('Error deleting block:', err);
      alert('Failed to delete block. Please try again.');
    }
  };

  const handleAddPanchayat = async (blockId: string) => {
    const panchayatName = newPanchayatName[blockId]?.trim();
    if (!panchayatName) return;

    const location = locations.find(loc => loc.id === blockId);
    if (!location) return;

    if (location.panchayats.some(p => p.toLowerCase() === panchayatName.toLowerCase())) {
      alert("Panchayat name already exists in this block.");
      return;
    }

    try {
      await updateLocation(blockId, {
        panchayats: [...location.panchayats, panchayatName]
      });
      setNewPanchayatName(prev => ({ ...prev, [blockId]: '' }));
    } catch (err) {
      console.error('Error adding panchayat:', err);
      alert('Failed to add panchayat. Please try again.');
    }
  };
  
  const handleDeletePanchayat = async (blockId: string, panchayatName: string) => {
     if (households.some(h => h.panchayat === panchayatName && h.block === locations.find(l => l.id === blockId)?.blockName)) {
        alert("Cannot delete a panchayat that is currently assigned to a household.");
        return;
    }
    
    const location = locations.find(loc => loc.id === blockId);
    if (!location) return;

    try {
      await updateLocation(blockId, {
        panchayats: location.panchayats.filter(p => p !== panchayatName)
      });
    } catch (err) {
      console.error('Error deleting panchayat:', err);
      alert('Failed to delete panchayat. Please try again.');
    }
  };


  // User Delete Modal Logic
  const requestDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteUserModalOpen(true);
  };

  const confirmUserDeletion = () => {
    if (userToDelete) {
      handleDeleteUser(userToDelete.id.toString());
    }
    setIsDeleteUserModalOpen(false);
    setUserToDelete(null);
  };
  
  // Household Actions Logic
  const openEditModal = (household: Household) => {
    setHouseholdToEdit(household);
    setIsEditModalOpen(true);
  };

  const openCalendarModal = (household: Household) => {
    setHouseholdToViewCalendar(household);
    setIsCalendarModalOpen(true);
  };

  const requestDeleteHousehold = (household: Household) => {
    setHouseholdToDelete(household);
    setIsDeleteHouseholdModalOpen(true);
  };

  const confirmHouseholdDeletion = () => {
    if (householdToDelete) {
      handleDeleteHousehold(householdToDelete.id.toString());
    }
    setIsDeleteHouseholdModalOpen(false);
    setHouseholdToDelete(null);
  };

  const filteredHouseholds = useMemo(() => {
    if (!searchQuery) {
      return households;
    }
    return households.filter(h =>
      h.houseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.block.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.panchayat.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, households]);

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold text-gray-900">Admin Panel</h2>

      
      {/* Location Management */}
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <LocationIcon /> Manage Locations
        </h3>
        <form onSubmit={handleAddBlock} className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="New Block Name"
              value={newBlockName}
              onChange={(e) => setNewBlockName(e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">Add Block</button>
        </form>
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
          {locations.map(loc => (
            <div key={loc.id} className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                    <p className="font-bold text-lg">{loc.blockName}</p>
                    <button onClick={() => handleDeleteBlock(loc.id)} className="p-1 text-red-500 rounded-full hover:bg-red-100" aria-label={`Delete block ${loc.blockName}`}><DeleteIcon className="w-5 h-5"/></button>
                </div>
                <div className="pl-4">
                    {loc.panchayats.map(panchayat => (
                        <div key={panchayat} className="flex justify-between items-center py-1">
                            <p className="text-gray-700">- {panchayat}</p>
                            <button onClick={() => handleDeletePanchayat(loc.id, panchayat)} className="p-1 text-gray-400 rounded-full hover:bg-gray-200" aria-label={`Delete panchayat ${panchayat}`}><DeleteIcon className="w-4 h-4"/></button>
                        </div>
                    ))}
                     <div className="flex gap-2 mt-2">
                        <input
                            type="text"
                            placeholder="New Panchayat"
                            value={newPanchayatName[loc.id] || ''}
                            onChange={(e) => setNewPanchayatName(prev => ({...prev, [loc.id]: e.target.value}))}
                            className="flex-grow px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                         />
                        <button onClick={() => handleAddPanchayat(loc.id)} className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600">Add</button>
                     </div>
                </div>
            </div>
          ))}
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Household Management */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <HomeIcon /> Manage Households
          </h3>
          <form onSubmit={handleAddHousehold} className="space-y-4 mb-6">
            <input
              type="text"
              placeholder="House Number (e.g., A-101)"
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="text"
              placeholder="Owner Name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <select
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                required
            >
                <option value="">-- Select Block --</option>
                {locations.map(loc => <option key={loc.id} value={loc.blockName}>{loc.blockName}</option>)}
            </select>
            <select
                value={selectedPanchayat}
                onChange={(e) => setSelectedPanchayat(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                disabled={!selectedBlock}
                required
            >
                <option value="">-- Select Panchayat --</option>
                {availablePanchayats.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition duration-300">
              Add Household
            </button>
          </form>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search households..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="max-h-80 overflow-y-auto pr-2 space-y-3">
            {filteredHouseholds.map(h => (
              <div key={h.id} className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
                <div>
                  <p className="font-semibold">{h.houseNumber} - {h.ownerName}</p>
                  <p className="text-sm text-gray-600">{h.block}, {h.panchayat}</p>
                  <p className="text-sm text-gray-500">{h.address}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEditModal(h)} className="p-2 text-gray-500 rounded-full hover:bg-blue-100 hover:text-blue-600" aria-label="Edit household"><EditIcon className="w-5 h-5" /></button>
                  <button onClick={() => openCalendarModal(h)} className="p-2 text-gray-500 rounded-full hover:bg-green-100 hover:text-green-600" aria-label="View collection calendar"><CalendarIcon className="w-5 h-5" /></button>
                  <button onClick={() => requestDeleteHousehold(h)} className="p-2 text-gray-500 rounded-full hover:bg-red-100 hover:text-red-600" aria-label="Delete household"><DeleteIcon className="w-5 h-5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <UserIcon /> Manage Users
          </h3>
          <form onSubmit={handleAddUser} className="space-y-4 mb-6">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              <option value={Role.Collector}>Collector</option>
              <option value={Role.Admin}>Admin</option>
            </select>
            <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition duration-300">
              Add User
            </button>
          </form>
          <div className="max-h-80 overflow-y-auto pr-2 space-y-3">
            {users.map(u => (
              <div key={u.id} className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <p className="font-semibold">{u.username}</p>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${u.role === Role.Admin ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                    {u.role}
                  </span>
                </div>
                <button
                  onClick={() => requestDeleteUser(u)}
                  disabled={u.id === currentUser.id}
                  className="p-2 text-gray-500 rounded-full hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  aria-label={`Delete user ${u.username}`}
                >
                  <DeleteIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {userToDelete && (
        <ConfirmModal
          isOpen={isDeleteUserModalOpen}
          onClose={() => setIsDeleteUserModalOpen(false)}
          onConfirm={confirmUserDeletion}
          title="Confirm User Deletion"
          message={`Are you sure you want to delete the user "${userToDelete.username}"? This action cannot be undone.`}
        />
      )}
      {householdToEdit && (
        <EditHouseholdModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          household={householdToEdit}
          locations={locations}
          onSave={(updatedHousehold) => {
            handleUpdateHousehold(updatedHousehold);
            setIsEditModalOpen(false);
          }}
        />
      )}
      {householdToViewCalendar && (
        <CalendarModal
          isOpen={isCalendarModalOpen}
          onClose={() => setIsCalendarModalOpen(false)}
          household={householdToViewCalendar}
          collectionRecords={collectionRecords}
          pendingDates={pendingDates}
          users={users}
          addPendingDate={addPendingDate}
          deletePendingDate={deletePendingDate}
        />
      )}
      {householdToDelete && (
        <ConfirmModal
          isOpen={isDeleteHouseholdModalOpen}
          onClose={() => setIsDeleteHouseholdModalOpen(false)}
          onConfirm={confirmHouseholdDeletion}
          title="Confirm Household Deletion"
          message={`Are you sure you want to delete the household "${householdToDelete.houseNumber} - ${householdToDelete.ownerName}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default AdminPanel;
