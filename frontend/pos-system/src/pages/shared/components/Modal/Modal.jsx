import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { createPortal } from 'react-dom';
import ModernButton from '../buttons/ModernButton';

const Modal = ({
  isOpen = false,
  onClose,
  title = '',
  children,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  footer = null,
  className = '',
  ...props
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Store the previously focused element
      previousActiveElement.current = document.activeElement;
      // Focus the modal
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Restore focus when modal closes
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleBackdropClick}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          className={`relative w-full ${sizeClasses[size]} bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all duration-200 ease-out animate-scale-in ${className}`}
          tabIndex={-1}
          {...props}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-gray-900 dark:text-white"
                >
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  aria-label="Close modal"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="p-6">
            <div id="modal-description">
              {children}
            </div>
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render using portal to avoid z-index issues
  return createPortal(modalContent, document.body);
};

// Confirmation Modal
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  ...props
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <ModernButton variant="outline" onClick={onClose}>
            {cancelText}
          </ModernButton>
          <ModernButton variant={variant} onClick={handleConfirm}>
            {confirmText}
          </ModernButton>
        </>
      }
      {...props}
    >
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
    </Modal>
  );
};

// Alert Modal
export const AlertModal = ({
  isOpen,
  onClose,
  title = 'Alert',
  message = '',
  type = 'info',
  buttonText = 'OK',
  ...props
}) => {
  const typeConfig = {
    info: { icon: 'ℹ️', variant: 'primary' },
    success: { icon: '✅', variant: 'success' },
    warning: { icon: '⚠️', variant: 'warning' },
    error: { icon: '❌', variant: 'error' },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <ModernButton variant={config.variant} onClick={onClose}>
          {buttonText}
        </ModernButton>
      }
      {...props}
    >
      <div className="text-center">
        <div className="text-4xl mb-4">{config.icon}</div>
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </Modal>
  );
};

// PropTypes for Modal
Modal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  closeOnBackdrop: PropTypes.bool,
  closeOnEscape: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  footer: PropTypes.node,
  className: PropTypes.string,
};

// PropTypes for ConfirmModal
ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'outline', 'ghost', 'link']),
};

// PropTypes for AlertModal
AlertModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  buttonText: PropTypes.string,
};

export default Modal;
