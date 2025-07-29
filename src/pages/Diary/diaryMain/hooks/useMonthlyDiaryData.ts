import { useState, useEffect } from 'react';
import { toastUtils } from '@/shared/components/Toast';
import { getMonthRange } from '@/shared/utils/dateUtils';
import { fetchMonthlyDiaries as getMonthlyDiariesFromSupabase } from '@/shared/api/diary';

type MonthEntry = {
  created_at: string;
};

export const useMonthlyDiaryData = (userId: string | null, selectedDate: Date) => {
  const [monthEntries, setMonthEntries] = useState<MonthEntry[]>([]);
  const [currentMonthDiaryCount, setCurrentMonthDiaryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonthEntries = async () => {
      setLoading(true);

      if (!userId) {
        setMonthEntries([]);
        setCurrentMonthDiaryCount(0);
        setLoading(false);
        return;
      }

      try {
        const { startUTC, endUTC } = getMonthRange(selectedDate);

        const data = await getMonthlyDiariesFromSupabase(userId, startUTC, endUTC);

        const entries = data && Array.isArray(data) ? data : [];
        const uniqueDates = new Set<string>();

        entries.forEach((entry: { created_at: string }) => {
          const dateOnly = entry.created_at.split('T')[0];
          uniqueDates.add(dateOnly);
        });

        setMonthEntries(entries);
        setCurrentMonthDiaryCount(uniqueDates.size);
      } catch (error) {
        console.error('월별 일기 항목 로드 실패:', error);
        toastUtils.error({ title: '실패', message: '월별 일기 목록을 불러오지 못했습니다.' });
        setMonthEntries([]);
        setCurrentMonthDiaryCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthEntries();
  }, [selectedDate, userId]);

  return { monthEntries, currentMonthDiaryCount, loading };
};
