import React from 'react';
import { Household, CollectionRecord } from '../types';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { MapPinIcon } from './icons/MapPinIcon';

interface DashboardProps {
  households: Household[];
  collectionRecords: CollectionRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ households, collectionRecords }) => {
  const collectedCount = households.filter(h => h.status === 'Collected').length;
  const pendingCount = households.length - collectedCount;
  const totalHouseholds = households.length;
  
  const pieData = [
    { name: 'Collected', value: collectedCount },
    { name: 'Pending', value: pendingCount },
  ];

  const COLORS = ['#10B981', '#F59E0B'];

  const recentCollections = [...collectionRecords]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-500">Total Households</h3>
          <p className="mt-3 text-4xl font-bold text-gray-900">{totalHouseholds}</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-500">Collected Today</h3>
          <p className="mt-3 text-4xl font-bold text-green-600">{collectedCount}</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-500">Pending Collection</h3>
          <p className="mt-3 text-4xl font-bold text-amber-500">{pendingCount}</p>
        </div>
      </div>

      {/* Chart and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Collection Status</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Collections</h3>
          <div className="space-y-4">
            {recentCollections.length > 0 ? recentCollections.map((record) => {
              const household = households.find(h => h.id === record.householdId);
              return (
                <div key={`${record.householdId}-${record.timestamp.toISOString()}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="text-green-500 w-6 h-6"/>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {household?.houseNumber} - {household?.address}
                      </p>
                      <p className="text-sm text-gray-500">
                        {record.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {record.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{record.location.latitude.toFixed(4)}, {record.location.longitude.toFixed(4)}</span>
                    </div>
                  )}
                </div>
              );
            }) : <p className="text-gray-500">No recent collection records.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;