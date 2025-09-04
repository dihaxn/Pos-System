import React from 'react';
import PropTypes from 'prop-types';
import { ButtonLoader } from '../LoadingWheel/LoadingWheel';

const ModernButton = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  rounded = 'md',
  icon = null,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 active:bg-primary-800',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 active:bg-secondary-800',
    success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 active:bg-success-800',
    warning: 'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500 active:bg-warning-800',
    error: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500 active:bg-error-800',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 active:bg-primary-100 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/20',
    ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500 active:bg-primary-100 dark:text-primary-400 dark:hover:bg-primary-900/20',
    link: 'text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline focus:ring-primary-500 dark:text-primary-400 dark:hover:text-primary-300',
  };

  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  const widthClasses = fullWidth ? 'w-full' : '';

  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    roundedClasses[rounded],
    widthClasses,
    className
  ].filter(Boolean).join(' ');

  const renderIcon = () => {
    if (!icon) return null;
    
    const iconClasses = size === 'xs' || size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    
    return (
      <span className={iconClasses}>
        {icon}
      </span>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <ButtonLoader size="sm" />
          {children && <span className="ml-2">{children}</span>}
        </>
      );
    }

    if (icon && iconPosition === 'left') {
      return (
        <>
          {renderIcon()}
          {children && <span className="ml-2">{children}</span>}
        </>
      );
    }

    if (icon && iconPosition === 'right') {
      return (
        <>
          {children && <span className="mr-2">{children}</span>}
          {renderIcon()}
        </>
      );
    }

    return children;
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

// Button Group Component
export const ButtonGroup = ({ children, className = '', ...props }) => (
  <div className={`inline-flex ${className}`} {...props}>
    {React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) return child;
      
      return React.cloneElement(child, {
        className: `${child.props.className || ''} ${
          index === 0 ? 'rounded-r-none' : ''
        } ${
          index === React.Children.count(children) - 1 ? 'rounded-l-none' : ''
        } ${
          index !== 0 && index !== React.Children.count(children) - 1 ? 'rounded-none' : ''
        } ${
          index !== 0 ? 'border-l-0' : ''
        }`,
      });
    })}
  </div>
);

// Icon Button Component
export const IconButton = ({ 
  icon, 
  size = 'md', 
  variant = 'ghost',
  ...props 
}) => (
  <ModernButton
    icon={icon}
    variant={variant}
    size={size}
    className="p-0 min-w-0"
    {...props}
  />
);

// PropTypes for ModernButton
ModernButton.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'outline', 'ghost', 'link']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', 'full']),
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
};

// PropTypes for ButtonGroup
ButtonGroup.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

// PropTypes for IconButton
IconButton.propTypes = {
  icon: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'outline', 'ghost', 'link']),
};

export default ModernButton;
