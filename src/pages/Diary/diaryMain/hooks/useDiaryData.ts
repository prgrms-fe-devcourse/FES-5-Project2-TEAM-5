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
        // 시작 일시 (UTC)
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const startOfDayUTC = startOfDay.toISOString();

        // 다음날 시작 일시 (UTC)
        const startOfNextDay = new Date(selectedDate);
        startOfNextDay.setDate(startOfNextDay.getDate() + 1);
        startOfNextDay.setHours(0, 0, 0, 0);
        const startOfNextDayUTC = startOfNextDay.toISOString();

        fetchDiariesByDate(userId, startOfDayUTC, startOfNextDayUTC);

        // 병렬로 데이터 가져오기
        const [rawDiaries, likesCount, commentsCount] = await Promise.all([
          fetchDiariesByDate(userId, startOfDayUTC, startOfNextDayUTC),
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
