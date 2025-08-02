import { useState, useEffect } from 'react';
import { toastUtils } from '@/shared/components/Toast';
import { transformDiaryData } from '@/shared/utils/formatSupabase';
import type { DiaryRowEntity, SupabaseDiaryResponse } from '@/shared/types/diary';
import { fetchDiariesByDate } from '@/shared/api/diary';
import { getAllDiariesLikesCount } from '@/shared/api/like';
import { getAllDiariesCommentsCount } from '@/shared/api/comment';

export const useDiaryData = (userId: string | null, selectedDate: Date) => {
  const [diaryList, setDiaryList] = useState<DiaryRowEntity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDiaryForDate = async () => {
      if (!userId || !selectedDate) {
        setDiaryList([]);
        return;
      }

      setLoading(true);

      try {
        // 선택된 날짜의 시작과 끝 시간 설정 (하루 전체)
        const selectedYear = selectedDate.getFullYear();
        const selectedMonth = selectedDate.getMonth();
        const selectedDay = selectedDate.getDate();

        // 선택된 날짜의 시작 (00:00:00)
        const startOfDay = new Date(selectedYear, selectedMonth, selectedDay);
        startOfDay.setHours(0, 0, 0, 0);

        // 선택된 날짜의 끝 (23:59:59)
        const endOfDay = new Date(selectedYear, selectedMonth, selectedDay);
        endOfDay.setHours(23, 59, 59, 999);

        // 한국 시간을 UTC로 변환 (UTC = KST - 9시간)
        const startOfDayUTC = new Date(startOfDay.getTime() - 9 * 60 * 60 * 1000).toISOString();
        const endOfDayUTC = new Date(endOfDay.getTime() - 9 * 60 * 60 * 1000).toISOString();

        const [rawDiaries, likesCount, commentsCount] = await Promise.all([
          fetchDiariesByDate(userId, startOfDayUTC, endOfDayUTC),
          getAllDiariesLikesCount(),
          getAllDiariesCommentsCount(),
        ]);

        if (!rawDiaries || !Array.isArray(rawDiaries)) {
          setDiaryList([]);
          return;
        }

        // 좋아요 및 댓글 수 추가
        const diariesWithCounts = rawDiaries.map((diary) => ({
          ...diary,
          likes: [{ count: likesCount[diary.id] || 0 }],
          comments: [{ count: commentsCount[diary.id] || 0 }],
        }));

        const transformedData = transformDiaryData(
          diariesWithCounts as unknown as SupabaseDiaryResponse[],
        );

        setDiaryList(transformedData || []);
      } catch (error) {
        console.error('Failed to load diaries:', error);
        toastUtils.error({
          title: '실패',
          message: '일기 목록 로드에 실패했습니다. 다시 시도해주세요.',
        });
        setDiaryList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDiaryForDate();
  }, [userId, selectedDate]);

  return { diaryList, loading };
};
