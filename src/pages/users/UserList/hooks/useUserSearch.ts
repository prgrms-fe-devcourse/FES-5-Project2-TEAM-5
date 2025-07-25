import { useMemo } from 'react';
import type { User } from '..';

export const useUserSearch = (users: User[], searchTerm: string) => {
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  return {
    filteredUsers,
  };
};
