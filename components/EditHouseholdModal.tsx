import React, { useState, useEffect } from 'react';
import { Household, AreaLocation } from '../types';

interface EditHouseholdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (household: Household) => void;
  household: Household;
  locations: AreaLocation[];
}

const EditHouseholdModal: React.FC<EditHouseholdModalProps> = ({ isOpen, onClose, onSave, household, locations }) => {
  const [formData, setFormData] = useState<Household>(household);
  const [availablePanchayats, setAvailablePanchayats] = useState<string[]>([]);

  useEffect(() => {
    setFormData(household);
  }, [household]);

  useEffect(() => {
    if (formData.block) {
      const location = locations.find(l => l.blockName === formData.block);
      setAvailablePanchayats(location ? location.panchayats : []);
    } else {
      setAvailablePanchayats([]);
    }
  }, [formData.block, locations]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'block') {
      // Reset panchayat when block changes
      setFormData(prev => ({ ...prev, panchayat: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 m-4">
        <h3 className="text-xl font-bold text-gray-900 mb-4" id="modal-title">Edit Household</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-700">House Number</label>
            <input type="text" name="houseNumber" id="houseNumber" value={formData.houseNumber} onChange={handleChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required />
          </div>
          <div>
            <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">Owner Name</label>
            <input type="text" name="ownerName" id="ownerName" value={formData.ownerName} onChange={handleChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required />
          </div>
          <div>
            <label htmlFor="block" className="block text-sm font-medium text-gray-700">Block</label>
            <select name="block" id="block" value={formData.block} onChange={handleChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white" required>
                <option value="">-- Select Block --</option>
                {locations.map(loc => <option key={loc.id} value={loc.blockName}>{loc.blockName}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="panchayat" className="block text-sm font-medium text-gray-700">Panchayat</label>
            <select name="panchayat" id="panchayat" value={formData.panchayat} onChange={handleChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white" disabled={!formData.block} required>
                <option value="">-- Select Panchayat --</option>
                {availablePanchayats.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHouseholdModal;
