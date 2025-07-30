import type { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { logout } from '../api/auth';
import supabase from '../api/supabase/client';
import type { Tables } from '../api/supabase/types';
import { getUserDataById, insertUserProfileOnLogin } from '../api/user';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<Tables<'users'> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getUserData = async (currentUser: User | null) => {
    if (!currentUser) {
      setUserInfo(null);
      return;
    }
    const userData = await getUserDataById(currentUser.id);
    setUserInfo(userData);
  };

  useEffect(() => {
    const initializeUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        void getUserData(currentUser);
      }
      setIsLoading(false);
    };

    initializeUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoading(true);
      const newUser = session?.user ?? null;
      setUser(newUser);

      if (newUser && event === 'INITIAL_SESSION') {
        await insertUserProfileOnLogin(newUser);
      }
      void getUserData(newUser);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateUserInfo = (user: Tables<'users'> | null) => {
    setUserInfo(user);
  };

  return {
    user,
    userInfo,
    isAuth: !!user,
    logout,
    updateUserInfo,
    isLoading,
  };
};
