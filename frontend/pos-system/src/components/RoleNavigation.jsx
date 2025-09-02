import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const RoleNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const getAvailablePages = (role) => {
    const allPages = [
      {
        path: '/owner',
        label: 'Owner Dashboard',
        icon: '👑',
        description: 'Sales comparison & analytics',
        roles: ['owner']
      },
      {
        path: '/factory-staff',
        label: 'Factory Dashboard',
        icon: '🏭',
        description: 'Production management',
        roles: ['owner', 'factory_staff']
      },
      {
        path: '/outlet',
        label: 'Outlet Dashboard',
        icon: '🏪',
        description: 'Sales & inventory',
        roles: ['owner', 'outlet_staff']
      }
    ];

    return allPages.filter(page => page.roles.includes(role));
  };

  const availablePages = getAvailablePages(user?.role);
  const currentPage = availablePages.find(page => page.path === location.pathname);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate('/login');
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and current page */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">LLOMS POS System</h1>
            {currentPage && (
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{currentPage.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{currentPage.label}</p>
                  <p className="text-xs text-gray-500">{currentPage.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Center - Navigation for available pages */}
          <div className="flex items-center space-x-2">
            {availablePages.map((page) => {
              const isActive = location.pathname === page.path;
              return (
                <motion.button
                  key={page.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(page.path)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{page.icon}</span>
                  {page.label}
                </motion.button>
              );
            })}
          </div>

          {/* Right side - User info and logout */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
              {user.outletName && (
                <p className="text-xs text-gray-500">{user.outletName}</p>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
            >
              Sign Out
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleNavigation;
