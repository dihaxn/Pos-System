import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Performance monitoring component for development
 */
const PerformanceMonitor = ({ 
  show = false, 
  onToggle,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(show);
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: null,
    loadTime: 0,
    bundleSize: 0
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  useEffect(() => {
    if (!isVisible) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationId;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        setMetrics(prev => ({
          ...prev,
          fps: Math.round((frameCount * 1000) / (currentTime - lastTime))
        }));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };

    const measureMemory = () => {
      if ('memory' in performance) {
        setMetrics(prev => ({
          ...prev,
          memory: {
            used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
            total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
            limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) // MB
          }
        }));
      }
    };

    const measureLoadTime = () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        setMetrics(prev => ({
          ...prev,
          loadTime: Math.round(navigation.loadEventEnd - navigation.loadEventStart)
        }));
      }
    };

    // Start measurements
    measureFPS();
    measureMemory();
    measureLoadTime();

    // Update memory every 2 seconds
    const memoryInterval = setInterval(measureMemory, 2000);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      clearInterval(memoryInterval);
    };
  }, [isVisible]);

  const handleToggle = () => {
    const newState = !isVisible;
    setIsVisible(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  const getPerformanceColor = (value, thresholds) => {
    if (value <= thresholds.good) return 'text-green-500';
    if (value <= thresholds.warning) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className={`fixed bottom-4 right-4 z-50 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="bg-black bg-opacity-90 text-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          <h3 className="font-bold text-sm">Performance Monitor</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isExpanded ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                )}
              </svg>
            </button>
            <button
              onClick={handleToggle}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="p-3 space-y-2 text-xs">
          <div className="flex justify-between">
            <span>FPS:</span>
            <span className={getPerformanceColor(metrics.fps, { good: 55, warning: 30 })}>
              {metrics.fps}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Load Time:</span>
            <span className={getPerformanceColor(metrics.loadTime, { good: 100, warning: 300 })}>
              {metrics.loadTime}ms
            </span>
          </div>

          {metrics.memory && (
            <div className="flex justify-between">
              <span>Memory:</span>
              <span className={getPerformanceColor(metrics.memory.used, { good: 50, warning: 100 })}>
                {metrics.memory.used}MB
              </span>
            </div>
          )}
        </div>

        {/* Expanded View */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-700 p-3 space-y-2 text-xs"
            >
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Bundle Size:</span>
                  <span>{metrics.bundleSize}KB</span>
                </div>
                
                {metrics.memory && (
                  <>
                    <div className="flex justify-between">
                      <span>Total Memory:</span>
                      <span>{metrics.memory.total}MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Memory Limit:</span>
                      <span>{metrics.memory.limit}MB</span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="pt-2">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition-colors"
                >
                  Reload & Measure
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

PerformanceMonitor.propTypes = {
  show: PropTypes.bool,
  onToggle: PropTypes.func,
  className: PropTypes.string
};

export default PerformanceMonitor;
