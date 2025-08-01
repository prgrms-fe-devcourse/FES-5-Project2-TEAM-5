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

        const startOfMonth = new Date(selectedYear, selectedMonth, 1);
        startOfMonth.setHours(0, 0, 0, 0);
        const startOfMonthUTC = startOfMonth.toISOString();

        const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);
        const endOfMonthUTC = endOfMonth.toISOString();

        const [rawDiaries, likesCount, commentsCount] = await Promise.all([
          fetchDiariesByDate(userId, startOfMonthUTC, endOfMonthUTC),
          getAllDiariesLikesCount(),
          getAllDiariesCommentsCount(),
        ]);

        if (!rawDiaries || !Array.isArray(rawDiaries)) {
          setDiaryList([]);
          return;
        }

        // 로컬 날짜 기준으로 변환
        const selectedDateStr =
          selectedDate.getFullYear() +
          '-' +
          String(selectedDate.getMonth() + 1).padStart(2, '0') +
          '-' +
          String(selectedDate.getDate()).padStart(2, '0');

        console.log('필터링 기준 날짜 (선택된 날짜):', selectedDateStr);

        const filteredDiaries = rawDiaries.filter((diary) => {
          // Supabase UTC 시간을 한국 시간으로 변환
          const diaryDateUTC = new Date(diary.created_at);
          const diaryDateKST = new Date(diaryDateUTC.getTime() + 9 * 60 * 60 * 1000); // UTC + 9시간
          const diaryDateStr =
            diaryDateKST.getFullYear() +
            '-' +
            String(diaryDateKST.getMonth() + 1).padStart(2, '0') +
            '-' +
            String(diaryDateKST.getDate()).padStart(2, '0');

          console.log(
            `일기 원본: ${diary.created_at} → KST: ${diaryDateStr} → 매치: ${
              diaryDateStr === selectedDateStr
            }`,
          );

          return diaryDateStr === selectedDateStr;
        });

        console.log('필터링된 일기 수:', filteredDiaries.length);

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
  }, [userId, selectedDate, currentCalendarMonth]);

  return { diaryList, loading };
};
