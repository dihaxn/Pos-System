import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Skeleton loading component for better UX
 */
const Skeleton = ({
  variant = 'text',
  width,
  height,
  className = '',
  lines = 1,
  animated = true
}) => {
  const baseClasses = 'bg-gray-200 rounded';
  
  const variants = {
    text: 'h-4',
    circular: 'rounded-full',
    rectangular: 'h-20',
    avatar: 'w-10 h-10 rounded-full'
  };
  
  const getClasses = () => {
    let classes = `${baseClasses} ${variants[variant]}`;
    
    if (width) {
      classes += ` w-${width}`;
    }
    if (height) {
      classes += ` h-${height}`;
    }
    
    return `${classes} ${className}`;
  };
  
  const SkeletonItem = () => (
    <motion.div
      className={getClasses()}
      animate={animated ? {
        opacity: [0.6, 1, 0.6],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      } : {}}
    />
  );
  
  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <SkeletonItem key={index} />
        ))}
      </div>
    );
  }
  
  return <SkeletonItem />;
};

Skeleton.propTypes = {
  variant: PropTypes.oneOf(['text', 'circular', 'rectangular', 'avatar']),
  width: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string,
  lines: PropTypes.number,
  animated: PropTypes.bool
};

export default Skeleton;
