import type { User } from '@supabase/supabase-js';
import { createContext, useContext, useMemo } from 'react';
import { useUser } from '../hooks/useUser';
import type { Tables } from '../api/supabase/types';

interface UserContextType {
  user: User | null;
  userInfo: Tables<'users'> | null;
  isAuth: boolean;
  logout: () => Promise<void>;
  updateUserInfo: (user: Tables<'users'> | null) => void;
  isLoading: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactElement }) => {
  const userState = useUser();

  const value = useMemo(() => userState, [userState]);

  return <UserContext value={value}>{children}</UserContext>;
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
