import { useState, useEffect } from 'react';
import { toastUtils } from '@/shared/components/Toast';
import { getMonthRange } from '@/shared/utils/dateUtils';
import { fetchEmotionStats as getEmotionStatsFromSupabase } from '@/shared/api/diary';
import type { EmotionMain } from '@/shared/types/diary';

export const useEmotionStats = (
  userId: string | null,
  selectedDate: Date,
  emotionMainsList: EmotionMain[],
  currentCalendarMonth: Date,
) => {
  const [emotionStatsData, setEmotionStatsData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmotionStatistics = async () => {
      setLoading(true);

      if (!userId || emotionMainsList.length === 0) {
        setEmotionStatsData([]);
        setLoading(false);
        return;
      }

      try {
        const { startUTC, endUTC } = getMonthRange(currentCalendarMonth);

        const data = await getEmotionStatsFromSupabase(userId, startUTC, endUTC);

        const initialCounts = new Array(emotionMainsList.length).fill(0);

        if (data && Array.isArray(data)) {
          (data as { emotion_main_id: number }[]).forEach((entry) => {
            const emotionIndex = emotionMainsList.findIndex(
              (emo) => emo.id === entry.emotion_main_id,
            );
            if (emotionIndex !== -1) {
              initialCounts[emotionIndex]++;
            }
          });
        }
        setEmotionStatsData(initialCounts);
      } catch (error) {
        console.error('감정 통계 로드 실패:', error);
        toastUtils.error({ title: '실패', message: '감정 통계를 불러오지 못했습니다.' });
        setEmotionStatsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmotionStatistics();
  }, [userId, selectedDate, emotionMainsList, currentCalendarMonth]);

  return { emotionStatsData, loading };
};
