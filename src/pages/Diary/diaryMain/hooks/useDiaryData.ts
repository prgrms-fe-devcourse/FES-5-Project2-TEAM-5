import { useState, useEffect } from 'react';
import { toastUtils } from '@/shared/components/Toast';
import { transformDiaryData } from '@/shared/utils/formatSupabase';
import type { DiaryRowEntity, SupabaseDiaryResponse } from '@/shared/types/diary';
import { fetchDiariesByDate } from '@/shared/api/diary';
import { getAllDiariesLikesCount } from '@/shared/api/like';
import { getAllDiariesCommentsCount } from '@/shared/api/comment';

export const useDiaryData = (
  userId: string | null,
  selectedDate: Date,
  currentCalendarMonth: Date,
) => {
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
        // 선택된 날짜의 월 기준으로 데이터 가져오기
        const selectedYear = selectedDate.getFullYear();
        const selectedMonth = selectedDate.getMonth();

        // 선택된 날짜가 속한 달의 전체 데이터 가져오기
        const startOfMonth = new Date(selectedYear, selectedMonth, 1);
        startOfMonth.setHours(0, 0, 0, 0);
        const startOfMonthUTC = startOfMonth.toISOString();

        const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);
        const endOfMonthUTC = endOfMonth.toISOString();

        // 병렬로 데이터 가져오기
        const [rawDiaries, likesCount, commentsCount] = await Promise.all([
          fetchDiariesByDate(userId, startOfMonthUTC, endOfMonthUTC),
          getAllDiariesLikesCount(),
          getAllDiariesCommentsCount(),
        ]);

        if (!rawDiaries || !Array.isArray(rawDiaries)) {
          setDiaryList([]);
          return;
        }

        // 선택된 날짜의 일기만 필터링
        const selectedDateStr = selectedDate.toISOString().split('T')[0];
        const filteredDiaries = rawDiaries.filter((diary) => {
          const diaryDateStr = new Date(diary.created_at).toISOString().split('T')[0];
          return diaryDateStr === selectedDateStr;
        });

        // 좋아요 및 댓글 수 추가
        const diariesWithCounts = filteredDiaries.map((diary) => ({
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
  }, [userId, selectedDate]); // currentCalendarMonth 의존성 제거

  return { diaryList, loading };
};
