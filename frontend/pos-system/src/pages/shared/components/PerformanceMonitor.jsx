import { useEffect, useState } from 'react';

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    if (import.meta.env.DEV) {
      // Monitor performance metrics in development
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            setMetrics(prev => ({
              ...prev,
              pageLoad: entry.loadEventEnd - entry.loadEventStart,
              domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
              firstPaint: entry.loadEventEnd - entry.navigationStart,
            }));
          }
        });
      });

      observer.observe({ entryTypes: ['navigation'] });

      // Monitor resource loading
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'resource') {
            setMetrics(prev => ({
              ...prev,
              resources: [...(prev.resources || []), {
                name: entry.name,
                duration: entry.duration,
                size: entry.transferSize,
              }],
            }));
          }
        });
      });

      resourceObserver.observe({ entryTypes: ['resource'] });

      return () => {
        observer.disconnect();
        resourceObserver.disconnect();
      };
    }
  }, []);

  if (!import.meta.env.DEV) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs max-w-xs">
      <h3 className="font-bold mb-2">Performance Monitor</h3>
      <div className="space-y-1">
        {metrics.pageLoad && (
          <div>Page Load: {metrics.pageLoad.toFixed(2)}ms</div>
        )}
        {metrics.domContentLoaded && (
          <div>DOM Ready: {metrics.domContentLoaded.toFixed(2)}ms</div>
        )}
        {metrics.firstPaint && (
          <div>First Paint: {metrics.firstPaint.toFixed(2)}ms</div>
        )}
        {metrics.resources && (
          <div>Resources: {metrics.resources.length}</div>
        )}
      </div>
    </div>
  );
};

export default PerformanceMonitor;
