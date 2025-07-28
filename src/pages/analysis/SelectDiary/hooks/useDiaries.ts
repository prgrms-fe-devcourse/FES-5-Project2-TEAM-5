import { useEffect, useState } from 'react';
import supabase from '@/shared/api/supabase/client';
import type { Database } from '@/shared/api/supabase/types';

type Diary = Database['public']['Tables']['diaries']['Row'];

export function useDiaries(userId?: string, isAuth?: boolean) {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuth || !userId) {
      setDiaries([]);
      setLoading(false);
      return;
    }

    const fetchDiaries = async () => {
      setLoading(true);
      const start = Date.now(); // 로딩 시작 시간

      const { data, error } = await supabase
        .from('diaries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      const loadTime = Date.now() - start;
      const minDelay = 700; // 스피너 최소 시간
      const delay = loadTime < minDelay ? (minDelay - loadTime) : 0;

      setTimeout(() => {
        if (error) {
          console.error('Error fetching diaries:', error);
          setDiaries([]);
        } else {
          setDiaries((data as Diary[]) || []);
        }
        setLoading(false);
      }, delay);
    };

    fetchDiaries();
  }, [userId, isAuth]);

  return { diaries, loading };
}