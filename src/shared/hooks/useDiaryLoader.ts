import { useState, useCallback, useEffect } from 'react';
import { type DiaryRowEntity } from '@/shared/types/diary';
import { toastUtils } from '@/shared/components/Toast';
import { getUserDiaries } from '@/shared/api/diary';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import type { DbUser } from '../types/dbUser';

export const useDiaryLoader = (userInfo: DbUser | null) => {
  const [diaries, setDiaries] = useState<DiaryRowEntity[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const loadDiaries = useCallback(
    async (page: number) => {
      if (!userInfo) return { data: [], hasMore: false };

      try {
        // 테스트 딜레이
        await new Promise((resolve) => setTimeout(resolve, 400));
        const apiPage = page + 1;
        const limit = 5;
        const data = await getUserDiaries(userInfo.id, apiPage, limit);

        setDiaries((prev) => {
          if (page === 0) return data;
          const combined = [...prev, ...data];
          return combined.filter(
            (diary, index, self) => index === self.findIndex((d) => d.id === diary.id),
          );
        });

        return {
          data,
          hasMore: data.length < limit ? false : true,
        };
      } catch (error) {
        if (error instanceof Error) {
          toastUtils.error({ title: '실패', message: error.message });
        }
        return { data: [], hasMore: false };
      }
    },
    [userInfo],
  );

  useEffect(() => {
    if (!userInfo || !initialLoading) return;

    const initLoad = async () => {
      await loadDiaries(0);
      setInitialLoading(false);
    };

    initLoad();
  }, [userInfo]);

  const { targetRef, isLoading, hasMore } = useInfiniteScroll(loadDiaries, {
    enabled: !!userInfo && !initialLoading,
    rootMargin: '100px',
  });

  return { diaries, targetRef, isLoading, hasMore, initialLoading };
};
