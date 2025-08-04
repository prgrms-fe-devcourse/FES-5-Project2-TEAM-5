import { useState, useEffect } from 'react';
import supabase from '@/shared/api/supabase/client';
import { toastUtils } from '@/shared/components/Toast';
import type { EmotionMain } from '@/shared/types/diary';

export const useEmotions = () => {
  const [emotions, setEmotions] = useState<EmotionMain[]>([]);
  const [isLoadingEmotions, setIsLoadingEmotions] = useState(true);

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        const { data, error } = await supabase
          .from('emotion_mains')
          .select('id, name, icon_url')
          .order('id');

        if (error) {
          console.error('감정 데이터 로드 실패:', error);
          toastUtils.error({ title: '실패', message: '감정 데이터를 불러오는데 실패했습니다.' });
          return;
        }

        setEmotions(data || []);
      } catch (error) {
        console.error('감정 데이터 로드 중 오류:', error);
        toastUtils.error({ title: '실패', message: '감정 데이터를 불러오는데 실패했습니다.' });
      } finally {
        setIsLoadingEmotions(false);
      }
    };

    fetchEmotions();
  }, []);

  return { emotions, isLoadingEmotions };
};
