import { useState, useCallback, useEffect } from 'react';
import { getUserCommentedDiaries, getUserDiaries, getUserLikedDiaries } from '@/shared/api/diary';
import { toastUtils } from '@/shared/components/Toast';
import type { DiaryRowEntity } from '@/shared/types/diary';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';

export const useUserDiaryLoader = (
  slug: string | undefined,
  activeTabId: string,
  loading: boolean,
) => {
  const [diaries, setDiaries] = useState<DiaryRowEntity[]>([]);

  const loadDiaries = useCallback(
    async (page: number) => {
      if (!slug) return { data: [], hasMore: false };

      try {
        // 테스트 딜레이
        await new Promise((resolve) => setTimeout(resolve, 1000));

        let data: DiaryRowEntity[] = [];
        const apiPage = page + 1;

        switch (activeTabId) {
          case 'diary':
            data = await getUserDiaries(slug, apiPage, 10);
            break;
          case 'like':
            data = await getUserLikedDiaries(slug, apiPage, 10);
            break;
          case 'comment':
            data = await getUserCommentedDiaries(slug, apiPage, 10);
            break;
        }

        const uniqueData = data.filter(
          (diary, index, self) => index === self.findIndex((d) => d.id === diary.id),
        );

        setDiaries((prev) => {
          if (page === 0) return uniqueData;

          const combined = [...prev, ...uniqueData];
          return combined.filter(
            (diary, index, self) => index === self.findIndex((d) => d.id === diary.id),
          );
        });

        return {
          data: uniqueData,
          hasMore: uniqueData.length === 10,
        };
      } catch (error) {
        if (error instanceof Error)
          toastUtils.error({ title: '다이어리 정보 로드 실패', message: error.message });
        return { data: [], hasMore: false };
      }
    },
    [slug, activeTabId],
  );

  const { targetRef, isLoading, hasMore, reset } = useInfiniteScroll(loadDiaries, {
    enabled: !loading && !!slug,
    rootMargin: '50px',
  });

  // 초기 로드 및 탭 변경 시 리셋
  useEffect(() => {
    if (!loading && slug) {
      setDiaries([]);
      reset();
      loadDiaries(0);
    }
  }, [activeTabId, loading, slug, loadDiaries, reset]);

  return { diaries, loadDiaries, targetRef, isLoading, hasMore };
};
