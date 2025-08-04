import type { DbUser } from '@/shared/types/dbUser';
import { useMemo } from 'react';

export const useUserSearch = (users: DbUser[], searchTerm: string) => {
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, users]);

  return {
    filteredUsers,
  };
};
