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

  const getUserData = async (currentUser: User) => {
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
      setUser(session?.user ?? null);

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        setUser(session?.user ?? null);

        if (session?.user && event === 'INITIAL_SESSION') {
          await insertUserProfileOnLogin(session.user);
        }

        if (session?.user) {
          await getUserData(session.user);
          setIsLoading(false);
        } else {
          setUserInfo(null);
        }
      });
      return () => subscription.unsubscribe();
    };

    initializeUser();
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
