import { useLocalStorage } from '@/shared/hooks';
import { useState } from 'react';

const SEEDIARY_KEY = 'seediary_remembered_user';

export const useRememberMe = () => {
  const { storedValue, setStoredValue, resetStorage } = useLocalStorage<string>(SEEDIARY_KEY, '');
  const [checked, setChecked] = useState(!!storedValue);

  const handleRememberMe = (email: string) => {
    if (checked) {
      setStoredValue(email);
    } else {
      resetStorage();
    }
  };

  const toggleChecked = () => {
    setChecked((prev) => !prev);
  };

  return {
    storedValue,
    checked,
    handleRememberMe,
    toggleChecked,
  };
};
