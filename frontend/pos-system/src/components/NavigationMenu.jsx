import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const NavigationMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navigationItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '🏠',
      description: 'Main dashboard',
      roles: ['owner', 'factory_staff', 'outlet_staff']
    },
    {
      path: '/owner',
      label: 'Owner View',
      icon: '👑',
      description: 'Sales comparison & analytics',
      roles: ['owner']
    },
    {
      path: '/factory-staff',
      label: 'Factory View',
      icon: '🏭',
      description: 'Production management',
      roles: ['owner', 'factory_staff']
    },
    {
      path: '/outlet',
      label: 'Outlet View',
      icon: '🏪',
      description: 'Sales & inventory',
      roles: ['owner', 'outlet_staff']
    }
  ];

  const canAccess = (item) => {
    return item.roles.includes(user?.role);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation Menu</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {navigationItems.map((item) => {
          const accessible = canAccess(item);
          const active = isActive(item.path);
          
          return (
            <motion.button
              key={item.path}
              whileHover={accessible ? { scale: 1.02 } : {}}
              whileTap={accessible ? { scale: 0.98 } : {}}
              onClick={() => accessible && navigate(item.path)}
              disabled={!accessible}
              className={`p-4 rounded-lg text-left transition-all duration-200 ${
                active
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : accessible
                  ? 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  : 'bg-gray-100 opacity-50 cursor-not-allowed border-2 border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className={`font-medium ${
                    active ? 'text-blue-900' : accessible ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {item.label}
                  </p>
                  <p className={`text-sm ${
                    active ? 'text-blue-700' : accessible ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </div>
              {!accessible && (
                <div className="mt-2">
                  <span className="text-xs text-red-500 font-medium">Access Denied</span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Current User:</strong> {user?.name} ({user?.role?.replace('_', ' ').toUpperCase()})
        </p>
        <p className="text-xs text-blue-600 mt-1">
          You can access: {navigationItems.filter(canAccess).map(item => item.label).join(', ')}
        </p>
      </div>
    </div>
  );
};

export default NavigationMenu;
