import React, { useState, useMemo } from 'react';
import { Household, CollectionRecord, User, PendingDate } from '../types';
import { MapPinIcon } from './icons/MapPinIcon';
import { UserIcon } from './icons/UserIcon';
import { CalendarIcon } from './icons/CalendarIcon';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  household: Household;
  collectionRecords: CollectionRecord[];
  pendingDates: PendingDate[];
  users: User[];
  addPendingDate: (pendingDate: Omit<PendingDate, 'id'>) => Promise<string>;
  deletePendingDate: (id: string) => Promise<void>;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, household, collectionRecords, pendingDates, users, addPendingDate, deletePendingDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedDayRecords, setSelectedDayRecords] = useState<CollectionRecord[] | null>(null);
  const [selectedDayPendingDates, setSelectedDayPendingDates] = useState<PendingDate[] | null>(null);
  const [showAddPendingModal, setShowAddPendingModal] = useState(false);
  const [pendingReason, setPendingReason] = useState('');

  const collectionsByDate = useMemo(() => {
    const recordsMap = new Map<string, CollectionRecord[]>();
    collectionRecords
      .filter(record => record.householdId === household.id)
      .forEach(record => {
        const dateStr = record.timestamp.toISOString().split('T')[0]; // YYYY-MM-DD
        if (!recordsMap.has(dateStr)) {
          recordsMap.set(dateStr, []);
        }
        recordsMap.get(dateStr)!.push(record);
      });
    return recordsMap;
  }, [collectionRecords, household.id]);

  const pendingDatesByDate = useMemo(() => {
    const pendingMap = new Map<string, PendingDate[]>();
    pendingDates
      .filter(pending => pending.householdId === household.id)
      .forEach(pending => {
        const dateStr = pending.date; // Already in YYYY-MM-DD format
        if (!pendingMap.has(dateStr)) {
          pendingMap.set(dateStr, []);
        }
        pendingMap.get(dateStr)!.push(pending);
      });
    return pendingMap;
  }, [pendingDates, household.id]);

  if (!isOpen) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1));
    setSelectedDay(null);
    setSelectedDayRecords(null);
    setSelectedDayPendingDates(null);
  };
  
  const handleDayClick = (day: number, records: CollectionRecord[] | undefined, pendingDates: PendingDate[] | undefined) => {
    setSelectedDay(day);
    setSelectedDayRecords(records || null);
    setSelectedDayPendingDates(pendingDates || null);
  };

  const handleAddPendingDate = async () => {
    if (!selectedDay) return;
    
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    
    try {
      await addPendingDate({
        householdId: household.id,
        date: dateStr,
        reason: pendingReason || undefined,
        createdAt: new Date()
      });
      setPendingReason('');
      setShowAddPendingModal(false);
    } catch (err) {
      console.error('Error adding pending date:', err);
      alert('Failed to add pending date. Please try again.');
    }
  };

  const handleDeletePendingDate = async (pendingId: string) => {
    try {
      await deletePendingDate(pendingId);
    } catch (err) {
      console.error('Error deleting pending date:', err);
      alert('Failed to delete pending date. Please try again.');
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`blank-${i}`} className="border border-transparent"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayRecords = collectionsByDate.get(dateStr);
      const dayPendingDates = pendingDatesByDate.get(dateStr);
      const isCollected = !!dayRecords;
      const isPending = !!dayPendingDates;

      let dayClasses = 'p-2 text-center border rounded-md transition-colors duration-150 flex items-center justify-center cursor-pointer';
      if (isCollected) {
        dayClasses += ' bg-green-200 text-green-800 font-bold hover:bg-green-300';
      } else if (isPending) {
        dayClasses += ' bg-yellow-200 text-yellow-800 font-bold hover:bg-yellow-300';
      } else {
        dayClasses += ' bg-gray-100 text-gray-500 hover:bg-gray-200';
      }
      if (day === selectedDay) {
        dayClasses += ' ring-2 ring-blue-500 ring-offset-1';
      }
      
      days.push(
        <div 
          key={day} 
          className={dayClasses}
          onClick={() => handleDayClick(day, dayRecords, dayPendingDates)}
        >
          {day}
        </div>
      );
    }
    return days;
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 m-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900" id="modal-title">
            Collection History for {household.houseNumber}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 text-2xl font-bold">&times;</button>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => changeMonth(-1)} className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300">&lt; Prev</button>
          <div className="font-bold text-lg">{monthName} {year}</div>
          <button onClick={() => changeMonth(1)} className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300">Next &gt;</button>
        </div>
        
        <div className="grid grid-cols-7 gap-2 text-sm text-center font-medium text-gray-500 mb-2">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {renderCalendarDays()}
        </div>
        
        {(selectedDayRecords || selectedDayPendingDates) && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-bold text-md text-gray-800 mb-2">
              Details for {monthName} {selectedDay}, {year}
            </h4>
            
            {selectedDayRecords && selectedDayRecords.length > 0 && (
              <div className="mb-4">
                <h5 className="font-semibold text-sm text-green-800 mb-2">Collection Records:</h5>
                <div className="space-y-3 max-h-32 overflow-y-auto pr-2">
                  {selectedDayRecords.map((record, index) => {
                    const collector = users.find(u => u.id === record.collectorId);
                    const collectorName = collector ? collector.username : `ID: ${record.collectorId}`;

                    return (
                      <div key={index} className="p-3 bg-green-50 rounded-md text-sm border border-green-200">
                        <p className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4 text-gray-500" />
                          <strong>Date & Time:</strong> {record.timestamp.toLocaleString()}
                        </p>
                        {record.location ? (
                          <p className="flex items-center gap-1">
                            <MapPinIcon className="w-4 h-4 text-gray-500" />
                            <strong>Location:</strong> {record.location.latitude.toFixed(6)}, {record.location.longitude.toFixed(6)}
                          </p>
                        ) : (
                          <p className="flex items-center gap-1 text-gray-500">
                            <MapPinIcon className="w-4 h-4 text-gray-400" />
                            <strong>Location:</strong> Not recorded.
                          </p>
                        )}
                        <p className="flex items-center gap-1">
                          <UserIcon className="w-4 h-4 text-gray-500" />
                          <strong>Collected by:</strong> {collectorName}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedDayPendingDates && selectedDayPendingDates.length > 0 && (
              <div className="mb-4">
                <h5 className="font-semibold text-sm text-yellow-800 mb-2">Pending Dates:</h5>
                <div className="space-y-3 max-h-32 overflow-y-auto pr-2">
                  {selectedDayPendingDates.map((pending, index) => (
                    <div key={index} className="p-3 bg-yellow-50 rounded-md text-sm border border-yellow-200 flex justify-between items-center">
                      <div>
                        <p className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4 text-gray-500" />
                          <strong>Date:</strong> {pending.date}
                        </p>
                        {pending.reason && <p><strong>Reason:</strong> {pending.reason}</p>}
                        <p className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4 text-gray-500" />
                          <strong>Created:</strong> {pending.createdAt.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeletePendingDate(pending.id)}
                        className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!selectedDayRecords || selectedDayRecords.length === 0) && (!selectedDayPendingDates || selectedDayPendingDates.length === 0) && (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-3">No records for this date</p>
                <button
                  onClick={() => setShowAddPendingModal(true)}
                  className="px-4 py-2 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                >
                  Mark as Pending
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700">
            Close
          </button>
        </div>
      </div>

      {/* Add Pending Date Modal */}
      {showAddPendingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Mark Date as Pending</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason (optional):
              </label>
              <textarea
                value={pendingReason}
                onChange={(e) => setPendingReason(e.target.value)}
                placeholder="Enter reason for marking as pending..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAddPendingModal(false);
                  setPendingReason('');
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPendingDate}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                Mark as Pending
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarModal;