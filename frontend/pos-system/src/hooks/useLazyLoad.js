import { useState, useEffect, useCallback } from 'react';

export const useLazyLoad = (importFunc, deps = []) => {
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadComponent = useCallback(async () => {
    try {
      setLoading(true);
      const module = await importFunc();
      setComponent(() => module.default || module);
      setError(null);
    } catch (err) {
      setError(err);
      console.error('Failed to load component:', err);
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    loadComponent();
  }, [loadComponent]);

  return { Component, loading, error, reload: loadComponent };
};
