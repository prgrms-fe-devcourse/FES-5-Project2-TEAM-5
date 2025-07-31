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

      // 기준 날짜 계산
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 14); // 14일 전
      startDate.setHours(0, 0, 0, 0); // 14일 전 자정으로 초기화
      const isoStartDate = startDate.toISOString();

      const { data, error } = await supabase
        .from('diaries')
        .select('id, title, content, created_at')
        .eq('user_id', userId)
        .eq('is_analyzed', false)
        .gte('created_at', isoStartDate) // 14일 이내
        .order('sequence', { ascending: false });

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
};