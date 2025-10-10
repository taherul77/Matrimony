import { useState, useEffect } from 'react';

export function useClientOnly() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      // Prefer sessionStorage for transient auth/session data (login uses sessionStorage)
      // but fall back to localStorage for older code that still writes there.
      let item: string | null = null;
      if (typeof window !== 'undefined') {
        item = window.sessionStorage.getItem(key) ?? window.localStorage.getItem(key);
      }
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        // Mirror writes to both storages so callers reading either storage will see the value.
        try {
          window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (e) {
          // ignore sessionStorage write failures (e.g., disabled)
        }
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (e) {
          // ignore localStorage write failures
        }
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, isClient] as const;
}
