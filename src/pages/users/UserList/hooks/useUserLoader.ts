import { useState, useCallback, useEffect } from 'react';
import type { DbUser } from '@/shared/types/dbUser';
import { getAllUserData } from '@/shared/api/user';
import { toastUtils } from '@/shared/components/Toast';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';

export const useUserLoader = (searchTerm: string) => {
  const [users, setUsers] = useState<DbUser[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const loadUsers = useCallback(
    async (page: number) => {
      try {
        // 테스트 딜레이
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const apiPage = page + 1;
        const data = await getAllUserData(apiPage, 20, searchTerm.trim() || undefined);

        setUsers((prev) => {
          if (page === 0) return data;
          const combined = [...prev, ...data];
          return combined.filter(
            (user, index, self) => index === self.findIndex((u) => u.id === user.id),
          );
        });

        return {
          data,
          hasMore: data.length === 20,
        };
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        toastUtils.error({ title: '실패', message: '예상하지 못한 에러 발생' });
        return { data: [], hasMore: false };
      }
    },
    [searchTerm],
  );

  const { targetRef, isLoading, hasMore, reset } = useInfiniteScroll(loadUsers, {
    enabled: true,
    rootMargin: '100px',
  });

  // 초기 로드
  useEffect(() => {
    const initialLoad = async () => {
      await loadUsers(0);
      setInitialLoading(false);
    };
    initialLoad();
  }, [loadUsers]);

  // 검색어 변경 시 리셋하고 새로 로드
  useEffect(() => {
    if (!initialLoading) {
      setUsers([]);
      reset();
      loadUsers(0);
    }
  }, [searchTerm, reset, loadUsers, initialLoading]);

  return { users, targetRef, isLoading, hasMore, initialLoading };
};
