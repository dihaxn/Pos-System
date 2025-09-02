import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const SecurityMonitor = ({ enabled = true }) => {
  const [threats, setThreats] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (enabled) {
      startMonitoring();
    }
    return () => stopMonitoring();
  }, [enabled]);

  const startMonitoring = () => {
    setIsMonitoring(true);
    console.log('Security monitoring started');
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    console.log('Security monitoring stopped');
  };

  if (!enabled) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.div 
        className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-blue-500"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            isMonitoring ? 'bg-green-500' : 'bg-gray-400'
          }`} />
          <div>
            <p className="text-sm font-medium text-gray-900">
              Security Monitor
            </p>
            <p className="text-xs text-gray-500">
              Status: {isMonitoring ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

SecurityMonitor.propTypes = {
  enabled: PropTypes.bool
};

export default SecurityMonitor;
