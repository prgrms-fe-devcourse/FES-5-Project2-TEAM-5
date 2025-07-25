import { useEffect, useState } from 'react';
import supabase from '../supabase/supabase';
import type { User } from '@supabase/supabase-js';
import type { Tables } from '../supabase/database.types';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<Tables<'users'> | null>(null);

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
    if (!user) {
      setUserInfo(null);
      return;
    }

    const getUserData = async () => {
      const { data, error } = await supabase.from('users').select().eq('id', user.id).single();
      if (error) {
        console.error(`사용자 정보 로드 실패 : ${error}`);
        setUserInfo(null);
      }
      setUserInfo(data);
    };

    getUserData();
  }, [user]);

  const logout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(`로그아웃 실패 : ${error}`);
    }
  };

  return { user, userInfo, isAuth: !!user, logout, profileImage: userInfo?.profile_image };
};
