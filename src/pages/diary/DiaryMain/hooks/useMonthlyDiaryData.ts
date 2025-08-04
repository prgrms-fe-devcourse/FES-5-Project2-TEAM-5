import { toastUtils } from '@/shared/components/Toast';
import { useEffect, useState } from 'react';
import { fetchMonthlyDiaries as getMonthlyDiariesFromSupabase } from '@/shared/api/diary';

type MonthEntry = {
  created_at: string;
};

export const useMonthlyDiaryData = (
  userId: string | null,
  selectedDate: Date,
  refreshTrigger?: number,
) => {
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
        // 달력에 실제로 표시되는 날짜 범위 계산
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();

        // 달력 첫째 주의 시작일 (이전 달 날짜 포함)
        const firstDayOfMonth = new Date(year, month, 1);
        const startOfCalendar = new Date(firstDayOfMonth);
        startOfCalendar.setDate(startOfCalendar.getDate() - firstDayOfMonth.getDay());

        // 달력 마지막 주의 끝일 (다음 달 날짜 포함)
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const endOfCalendar = new Date(lastDayOfMonth);
        endOfCalendar.setDate(endOfCalendar.getDate() + (6 - lastDayOfMonth.getDay()));

        // UTC로 변환
        const startUTC = startOfCalendar.toISOString();
        const endUTC = endOfCalendar.toISOString();

        const data = await getMonthlyDiariesFromSupabase(userId, startUTC, endUTC);

        const entries = data && Array.isArray(data) ? data : [];

        // 현재 월에 해당하는 일기만 카운트 (통계용)
        const currentMonthEntries = entries.filter((entry) => {
          const entryDate = new Date(entry.created_at);
          return entryDate.getMonth() === month && entryDate.getFullYear() === year;
        });

        const uniqueDatesInCurrentMonth = new Set<string>();
        currentMonthEntries.forEach((entry: { created_at: string }) => {
          const dateOnly = entry.created_at.split('T')[0];
          uniqueDatesInCurrentMonth.add(dateOnly);
        });

        setMonthEntries(entries); // 모든 날짜의 일기 데이터
        setCurrentMonthDiaryCount(uniqueDatesInCurrentMonth.size); // 현재 월만 카운트
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
  }, [selectedDate, userId, refreshTrigger]);

  return { monthEntries, currentMonthDiaryCount, loading };
};
