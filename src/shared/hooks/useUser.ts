import type { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { logout } from '../api/auth';
import supabase from '../api/supabase/client';
import type { Tables } from '../api/supabase/types';
import { getUserDataById } from '../api/user';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<Tables<'users'> | null>(null);

  const getUserData = async () => {
    if (!user) {
      setUserInfo(null);
      return;
    }
    const userData = await getUserDataById(user.id);
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
      } = supabase.auth.onAuthStateChange(async (_, session) => {
        setUser(session?.user ?? null);

        if (!session?.user) {
          setUserInfo(null);
        }
      });
      return () => subscription.unsubscribe();
    };

    initializeUser();
  }, []);

  useEffect(() => {
    getUserData();
  }, [user]);

  const updateUserInfo = (user: Tables<'users'> | null) => {
    setUserInfo(user);
  };

  return {
    user,
    userInfo,
    isAuth: !!user,
    logout,
    updateUserInfo,
  };
};
