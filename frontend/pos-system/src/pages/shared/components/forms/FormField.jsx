import React from 'react';
import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  disabled = false,
  error = null,
  success = null,
  helperText = null,
  className = '',
  ...props
}) => {
  const inputId = `field-${name}`;
  const hasError = !!error;
  const hasSuccess = !!success;
  const isRequired = required;

  const getInputClasses = () => {
    const baseClasses = 'block w-full px-3 py-2 border rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    if (hasError) {
      return `${baseClasses} border-error-300 text-error-900 placeholder-error-300 focus:border-error-500 focus:ring-error-500 dark:border-error-600 dark:text-error-100 dark:placeholder-error-600`;
    }
    
    if (hasSuccess) {
      return `${baseClasses} border-success-300 text-success-900 placeholder-success-300 focus:border-success-500 focus:ring-success-500 dark:border-success-600 dark:text-success-100 dark:placeholder-success-600`;
    }
    
    return `${baseClasses} border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500 dark:bg-gray-800`;
  };

  const renderIcon = () => {
    if (hasError) {
      return <ExclamationCircleIcon className="w-5 h-5 text-error-500" />;
    }
    
    if (hasSuccess) {
      return <CheckCircleIcon className="w-5 h-5 text-success-500" />;
    }
    
    return null;
  };

  const renderMessage = () => {
    if (hasError) {
      return (
        <p className="mt-1 text-sm text-error-600 dark:text-error-400 flex items-center">
          <ExclamationCircleIcon className="w-4 h-4 mr-1" />
          {error}
        </p>
      );
    }
    
    if (hasSuccess) {
      return (
        <p className="mt-1 text-sm text-success-600 dark:text-success-400 flex items-center">
          <CheckCircleIcon className="w-4 h-4 mr-1" />
          {success}
        </p>
      );
    }
    
    if (helperText) {
      return (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      );
    }
    
    return null;
  };

  return (
    <div className={className}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
          {isRequired && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={isRequired}
          disabled={disabled}
          className={getInputClasses()}
          aria-invalid={hasError}
          aria-describedby={hasError || hasSuccess || helperText ? `${inputId}-message` : undefined}
          {...props}
        />
        
        {renderIcon() && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {renderIcon()}
          </div>
        )}
      </div>
      
      {renderMessage() && (
        <div id={`${inputId}-message`} className="mt-1">
          {renderMessage()}
        </div>
      )}
    </div>
  );
};

// Text Area Component
export const FormTextArea = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  disabled = false,
  error = null,
  success = null,
  helperText = null,
  rows = 4,
  className = '',
  ...props
}) => {
  const inputId = `field-${name}`;
  const hasError = !!error;
  const hasSuccess = !!success;
  const isRequired = required;

  const getTextAreaClasses = () => {
    const baseClasses = 'block w-full px-3 py-2 border rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 resize-vertical';
    
    if (hasError) {
      return `${baseClasses} border-error-300 text-error-900 placeholder-error-300 focus:border-error-500 focus:ring-error-500 dark:border-error-600 dark:text-error-100 dark:placeholder-error-600`;
    }
    
    if (hasSuccess) {
      return `${baseClasses} border-success-300 text-success-900 placeholder-success-300 focus:border-success-500 focus:ring-success-500 dark:border-success-600 dark:text-success-100 dark:placeholder-success-600`;
    }
    
    return `${baseClasses} border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500 dark:bg-gray-800`;
  };

  return (
    <div className={className}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
          {isRequired && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={isRequired}
        disabled={disabled}
        rows={rows}
        className={getTextAreaClasses()}
        aria-invalid={hasError}
        aria-describedby={hasError || hasSuccess || helperText ? `${inputId}-message` : undefined}
        {...props}
      />
      
      {(error || success || helperText) && (
        <div id={`${inputId}-message`} className="mt-1">
          {error && (
            <p className="text-sm text-error-600 dark:text-error-400 flex items-center">
              <ExclamationCircleIcon className="w-4 h-4 mr-1" />
              {error}
            </p>
          )}
          
          {success && (
            <p className="text-sm text-success-600 dark:text-success-400 flex items-center">
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              {success}
            </p>
          )}
          
          {helperText && !error && !success && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {helperText}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FormField;
