import { useState } from 'react';
import type { IRegisterForm } from './type';
import { registerValidator } from './validator';

export const useForm = (initialData: IRegisterForm) => {
  const [formData, setFormData] = useState<IRegisterForm>(initialData);
  const [error, setError] = useState<string>('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const errorMessage = registerValidator[name as keyof IRegisterForm](value, formData);
    if (errorMessage) {
      setError(errorMessage);
    } else {
      setError('');
    }
  };

  const validateAll = (): boolean => {
    for (const key in registerValidator) {
      const properties = key as keyof IRegisterForm;
      const errorMessage = registerValidator[properties](formData[properties], formData);

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
    validateAll,
  };
};
