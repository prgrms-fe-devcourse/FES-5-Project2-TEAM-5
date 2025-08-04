import { useState, useCallback, useEffect } from 'react';
import {
  getUserCommentedDiaries,
  getUserLikedDiaries,
  getUserPublicDiaries,
} from '@/shared/api/diary';
import { toastUtils } from '@/shared/components/Toast';
import type { DiaryRowEntity } from '@/shared/types/diary';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';

export const useUserDiaryLoader = (
  slug: string | undefined,
  activeTabId: string,
  loading: boolean,
) => {
  const [diaries, setDiaries] = useState<DiaryRowEntity[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isTabChanging, setIsTabChanging] = useState(false);

  const loadDiaries = useCallback(
    async (page: number) => {
      if (!slug) return { data: [], hasMore: false };

      try {
        if (page === 1) {
          setIsInitialLoading(true);
        }
        // 테스트 딜레이
        await new Promise((resolve) => setTimeout(resolve, 400));

        let data: DiaryRowEntity[] = [];
        const apiPage = page;
        const limit = 5;

        switch (activeTabId) {
          case 'diary':
            data = await getUserPublicDiaries(slug, apiPage, limit);
            break;
          case 'like':
            data = await getUserLikedDiaries(slug, apiPage, limit);
            break;
          case 'comment':
            data = await getUserCommentedDiaries(slug, apiPage, limit);
            break;
        }

        const uniqueData = data.filter(
          (diary, index, self) => index === self.findIndex((d) => d.id === diary.id),
        );

        setDiaries((prev) => {
          if (page === 1) {
            return uniqueData;
          }

          const combined = [...prev, ...uniqueData];
          const filtered = combined.filter(
            (diary, index, self) => index === self.findIndex((d) => d.id === diary.id),
          );
          return filtered;
        });

        const hasMore = uniqueData.length < limit ? false : true;

        return {
          data: uniqueData,
          hasMore: hasMore,
        };
      } catch (error) {
        if (error instanceof Error)
          toastUtils.error({ title: '다이어리 정보 로드 실패', message: error.message });
        return { data: [], hasMore: false };
      } finally {
        if (page === 1) {
          setIsInitialLoading(false);
          setIsTabChanging(false);
        }
      }
    },
    [slug, activeTabId],
  );

  const { targetRef, isLoading, hasMore, reset } = useInfiniteScroll(loadDiaries, {
    enabled: !loading && !!slug,
    rootMargin: '50px',
  });

  useEffect(() => {
    if (!loading && slug) {
      setIsTabChanging(true);
      setIsInitialLoading(true);
      setDiaries([]);
      reset();
    }
  }, [activeTabId, slug, reset, loading]);

  return {
    diaries,
    targetRef,
    isLoading,
    hasMore,
    isInitialLoading: loading || isInitialLoading || isTabChanging,
    isTabChanging,
  };
};
