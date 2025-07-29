import type { User } from '@supabase/supabase-js';
import { useEffect, useRef, useState } from 'react';
import { logout } from '../api/auth';
import supabase from '../api/supabase/client';
import type { Tables } from '../api/supabase/types';
import { getUserDataById, insertUserProfileOnLogin } from '../api/user';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<Tables<'users'> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const unsubscribeRef = useRef<() => void | null>(null);

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
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (session?.user) {
        await getUserData(session.user);
      }
      setIsLoading(false);

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        const newUser = session?.user ?? null;
        setUser(newUser);

        if (newUser && event === 'INITIAL_SESSION') {
          await insertUserProfileOnLogin(newUser);
        }

        if (newUser) {
          await getUserData(newUser);
        } else {
          setUserInfo(null);
        }
        setIsLoading(false);
      });
      unsubscribeRef.current = subscription.unsubscribe;
    };

    initializeUser();
    return () => {
      unsubscribeRef.current?.();
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
