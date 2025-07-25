import { useEffect, useState } from 'react';
import supabase from '../supabase/supabase';
import type { User } from '@supabase/supabase-js';
import { getUserProfile } from '../utils/supabase/getUserProfile';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setProfileImage(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      getUserProfile(user.id).then(setProfileImage);
    }
  }, [user]);

  const logout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(`로그아웃 실패 : ${error}`);
    }
  };

  return { user, isAuth: !!user, logout, profileImage };
};
