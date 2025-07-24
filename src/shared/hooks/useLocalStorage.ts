import { useState } from 'react';

export const useLocalStorage = <T>(
  key: string,
  initialVale: T,
): { storedValue: T; setStoredValue: (value: T) => void; resetStorage: () => void } => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialVale;
    } catch (error) {
      console.error(`localStorage getItem error : ${error}`);
      return initialVale;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`localStorage setItem error : ${error}`);
    }
  };

  const resetStorage = () => {
    try {
      setStoredValue(initialVale);
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`localStorage reset error : ${error}`);
    }
  };

  return { storedValue, setStoredValue: setValue, resetStorage };
};
