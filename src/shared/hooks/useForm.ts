import { useState } from 'react';
import type { ValidationType } from '../types/validation';

export const useForm = <T>({
  initialData,
  validator,
}: {
  initialData: T;
  validator?: ValidationType<T>;
}) => {
  const [formData, setFormData] = useState<T>(initialData);
  const [error, setError] = useState<string>('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    const property = name as keyof T;
    const errorMessage = validator ? validator[property](newFormData[property], formData) : null;
    if (errorMessage) {
      setError(errorMessage);
    } else {
      setError('');
    }
  };

  const validateAll = (): boolean => {
    for (const key in validator) {
      const properties = key as keyof T;
      const errorMessage = validator ? validator[properties](formData[properties], formData) : null;

      if (errorMessage) {
        setError(errorMessage);
        return false;
      }
    }
    return true;
  };

  return {
    error,
    onChange,
    formData,
    setFormData,
    validateAll,
  };
};
