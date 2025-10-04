import React from 'react';
import { View, User, Role } from '../types';
import { HomeIcon } from './icons/HomeIcon';
import { AdminIcon } from './icons/AdminIcon';
import { CollectorIcon } from './icons/CollectorIcon';
import { TrashIcon } from './icons/TrashIcon';
import { LogoutIcon } from './icons/LogoutIcon';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  currentView: View;
  setCurrentView: (view: View) => void;
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, currentView, setCurrentView, onLoginClick }) => {

  const adminNavItems = [
    { view: View.Dashboard, label: 'Dashboard', icon: <HomeIcon /> },
    { view: View.Admin, label: 'Admin Panel', icon: <AdminIcon /> },
  ];

  const getButtonClasses = (view: View) => {
    const baseClasses = 'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500';
    if (currentView === view) {
      return `${baseClasses} bg-green-600 text-white shadow-md`;
    }
    return `${baseClasses} text-gray-600 bg-white hover:bg-gray-100 hover:text-gray-900`;
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-full text-white">
              <TrashIcon />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">EcoTrack</h1>
          </div>
          
          {currentUser ? (
            <div className="flex items-center gap-4">
              {currentUser.role === Role.Admin && (
                <nav className="flex items-center space-x-2 sm:space-x-4">
                  {adminNavItems.map(item => (
                    <button
                      key={item.view}
                      onClick={() => setCurrentView(item.view)}
                      className={getButtonClasses(item.view)}
                    >
                      {item.icon}
                      <span className="hidden sm:inline">{item.label}</span>
                    </button>
                  ))}
                </nav>
              )}
              <div className="flex items-center gap-3">
                <span className="text-gray-700 text-sm font-medium hidden sm:block">
                  Welcome, <span className="font-bold">{currentUser.username}</span>
                </span>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 bg-red-500 text-white hover:bg-red-600"
                  aria-label="Logout"
                >
                  <LogoutIcon />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          ) : (
             <button
                onClick={onLoginClick}
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition duration-200"
              >
                Login
              </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;