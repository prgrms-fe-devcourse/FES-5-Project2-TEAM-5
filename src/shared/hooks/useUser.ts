import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import supabase from '../api/supabase/client';
import type { Tables } from '../api/supabase/types';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<Tables<'users'> | null>(null);

  const getUserData = async () => {
    if (!user) {
      setUserInfo(null);
      return;
    }
    const { data, error } = await supabase.from('users').select().eq('id', user.id).single();
    if (error) {
      console.error(`사용자 정보 로드 실패 : ${error}`);
      setUserInfo(null);
    }
    setUserInfo(data);
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

  const logout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(`로그아웃 실패 : ${error}`);
    }
  };

  return {
    user,
    userInfo,
    isAuth: !!user,
    logout,
    updateUserInfo,
  };
};
