import React from 'react';
import { 
  DocumentTextIcon, 
  ShoppingBagIcon, 
  UserGroupIcon, 
  CogIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const EmptyState = ({ 
  type = 'default',
  title = 'No data found',
  description = 'There are no items to display at the moment.',
  action = null,
  illustration = null,
  className = ''
}) => {
  const getIcon = () => {
    switch (type) {
      case 'orders':
        return <ShoppingBagIcon className="w-16 h-16 text-gray-400" />;
      case 'users':
        return <UserGroupIcon className="w-16 h-16 text-gray-400" />;
      case 'documents':
        return <DocumentTextIcon className="w-16 h-16 text-gray-400" />;
      case 'settings':
        return <CogIcon className="w-16 h-16 text-gray-400" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-16 h-16 text-error-400" />;
      case 'info':
        return <InformationCircleIcon className="w-16 h-16 text-primary-400" />;
      case 'success':
        return <CheckCircleIcon className="w-16 h-16 text-success-400" />;
      default:
        return <DocumentTextIcon className="w-16 h-16 text-gray-400" />;
    }
  };

  const getDefaultDescription = () => {
    switch (type) {
      case 'orders':
        return 'No orders have been placed yet. When customers make orders, they will appear here.';
      case 'users':
        return 'No users found. Users will appear here once they are added to the system.';
      case 'documents':
        return 'No documents available. Documents will appear here once they are uploaded.';
      case 'settings':
        return 'No settings configured. Configure your preferences to get started.';
      case 'error':
        return 'Something went wrong. Please try again or contact support if the issue persists.';
      case 'info':
        return 'This section is currently empty. Check back later for updates.';
      case 'success':
        return 'Operation completed successfully!';
      default:
        return 'There are no items to display at the moment.';
    }
  };

  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="flex justify-center mb-6">
        {illustration || getIcon()}
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
        {description || getDefaultDescription()}
      </p>
      
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};

// Specific empty state components
export const NoOrders = ({ action, className }) => (
  <EmptyState
    type="orders"
    title="No Orders Yet"
    description="No orders have been placed yet. When customers make orders, they will appear here."
    action={action}
    className={className}
  />
);

export const NoUsers = ({ action, className }) => (
  <EmptyState
    type="users"
    title="No Users Found"
    description="No users found. Users will appear here once they are added to the system."
    action={action}
    className={className}
  />
);

export const NoProducts = ({ action, className }) => (
  <EmptyState
    type="documents"
    title="No Products Available"
    description="No products have been added yet. Add your first product to get started."
    action={action}
    className={className}
  />
);

export const NoData = ({ title, description, action, className }) => (
  <EmptyState
    title={title}
    description={description}
    action={action}
    className={className}
  />
);

export const ErrorState = ({ title, description, action, className }) => (
  <EmptyState
    type="error"
    title={title || "Something went wrong"}
    description={description}
    action={action}
    className={className}
  />
);

export const InfoState = ({ title, description, action, className }) => (
  <EmptyState
    type="info"
    title={title || "Information"}
    description={description}
    action={action}
    className={className}
  />
);

export default EmptyState;
