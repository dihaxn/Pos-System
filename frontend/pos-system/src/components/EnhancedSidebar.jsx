import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  UserIcon, 
  CogIcon, 
  BellIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const EnhancedSidebar = ({ navItemList = [], isOpen = true, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [outletInfo, setOutletInfo] = useState({
    name: 'Main Outlet',
    address: '123 Main Street, Colombo',
    phone: '+94 11 234 5678',
    email: 'main@littlelanka.com',
    status: 'Open',
    hours: '8:00 AM - 10:00 PM'
  });

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate('/login');
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'owner':
        return 'Owner';
      case 'factory_staff':
        return 'Factory Staff';
      case 'outlet_staff':
        return 'Outlet Staff';
      default:
        return role;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner':
        return '👑';
      case 'factory_staff':
        return '🏭';
      case 'outlet_staff':
        return '🏪';
      default:
        return '👤';
    }
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: isOpen ? 0 : -300 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed left-0 top-0 h-full bg-gradient-to-b from-pink-500 to-pink-600 text-white shadow-2xl z-50 ${
        isOpen ? 'w-80' : 'w-0'
      } overflow-hidden`}
    >
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="p-6 border-b border-pink-400">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Little Lanka</h1>
              <p className="text-pink-100 text-sm">Pvt Ltd</p>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-pink-400 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* User Info Section */}
        <div className="p-6 border-b border-pink-400">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-pink-300 rounded-full flex items-center justify-center">
              <span className="text-2xl">{getRoleIcon(user?.role)}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{user?.name || 'User'}</h3>
              <p className="text-pink-100 text-sm">{getRoleDisplayName(user?.role)}</p>
              {user?.outletName && (
                <p className="text-pink-200 text-xs">{user.outletName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Current Time & Date */}
        <div className="p-4 border-b border-pink-400">
          <div className="bg-pink-400 bg-opacity-30 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <ClockIcon className="w-5 h-5" />
              <span className="font-semibold">Current Time</span>
            </div>
            <p className="text-2xl font-bold">{formatTime(currentTime)}</p>
            <p className="text-pink-100 text-sm">{formatDate(currentTime)}</p>
          </div>
        </div>

        {/* Outlet Information */}
        <div className="p-4 border-b border-pink-400">
          <div className="bg-pink-400 bg-opacity-30 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-3">
              <MapPinIcon className="w-5 h-5" />
              <span className="font-semibold">Outlet Details</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Name:</span>
                <span className="text-pink-100">{outletInfo.name}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-pink-100 text-xs">{outletInfo.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="w-4 h-4" />
                <span className="text-pink-100 text-xs">{outletInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="w-4 h-4" />
                <span className="text-pink-100 text-xs">{outletInfo.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  outletInfo.status === 'Open' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {outletInfo.status}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Hours:</span>
                <span className="text-pink-100 text-xs">{outletInfo.hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 p-4">
          <h3 className="text-lg font-semibold mb-4">Navigation</h3>
          <div className="space-y-2">
            {navItemList.map((item, index) => {
              const isActive = location.pathname === item.path || 
                (item.nameBtn && location.pathname.includes(item.nameBtn.toLowerCase()));
              
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={item.fun}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-pink-300 text-pink-900 shadow-md'
                      : 'hover:bg-pink-400 hover:bg-opacity-50'
                  }`}
                >
                  {item.iconUrl && (
                    <img 
                      src={item.iconUrl} 
                      alt={item.nameBtn} 
                      className="w-5 h-5"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <span className="font-medium">{item.nameBtn}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Logout Section */}
        <div className="p-4 border-t border-pink-400">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Sign Out</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedSidebar;
