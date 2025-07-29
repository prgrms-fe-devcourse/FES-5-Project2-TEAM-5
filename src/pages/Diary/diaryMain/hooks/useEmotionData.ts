import { useState, useEffect } from 'react';
import { toastUtils } from '@/shared/components/Toast';
import { getAllEmotionMains } from '@/shared/api/emotionMain';

interface EmotionMain {
  id: number;
  name: string;
  icon_url: string;
}

export const useEmotionData = () => {
  const [emotionMainsList, setEmotionMainsList] = useState<EmotionMain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEmotionMains = async () => {
      try {
        setLoading(true);
        const data = await getAllEmotionMains();

        if (data) {
          setEmotionMainsList(data);
        } else {
          setEmotionMainsList([]);
        }
      } catch (error) {
        console.error('감정 목록 로드 실패:', error);
        toastUtils.error({ title: '실패', message: '감정 목록을 불러오지 못했습니다.' });
        setEmotionMainsList([]);
      } finally {
        setLoading(false);
      }
    };

    getEmotionMains();
  }, []);

  return { emotionMainsList, loading };
};
