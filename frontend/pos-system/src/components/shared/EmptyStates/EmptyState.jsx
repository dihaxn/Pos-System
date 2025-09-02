import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * EmptyState component for when there's no data to display
 */
const EmptyState = ({
  title = 'No Data Available',
  description = 'There are no items to display at the moment.',
  icon,
  action,
  actionText,
  onAction,
  className = '',
  variant = 'default'
}) => {
  const variants = {
    default: 'text-gray-500',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    success: 'text-green-600'
  };
  
  const iconVariants = {
    default: 'text-gray-300',
    warning: 'text-yellow-300',
    error: 'text-red-300',
    success: 'text-green-300'
  };
  
  const defaultIcon = (
    <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  );
  
  return (
    <motion.div
      className={`text-center py-12 px-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`${iconVariants[variant]} mb-4`}>
        {icon || defaultIcon}
      </div>
      
      <h3 className={`text-lg font-medium ${variants[variant]} mb-2`}>
        {title}
      </h3>
      
      {description && (
        <p className={`text-sm ${variants[variant]} mb-6 max-w-md mx-auto`}>
          {description}
        </p>
      )}
      
      {action && actionText && onAction && (
        <motion.button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {action}
          {actionText && <span className="ml-2">{actionText}</span>}
        </motion.button>
      )}
    </motion.div>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.node,
  action: PropTypes.node,
  actionText: PropTypes.string,
  onAction: PropTypes.func,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'warning', 'error', 'success'])
};

export default EmptyState;
