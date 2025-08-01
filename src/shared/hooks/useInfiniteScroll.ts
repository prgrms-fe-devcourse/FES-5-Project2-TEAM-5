import { useEffect, useRef, useCallback, useState } from 'react';

interface InfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

interface LoadMoreResult<T> {
  data: T[];
  hasMore: boolean;
}

export const useInfiniteScroll = <T>(
  loadMore: (page: number) => Promise<LoadMoreResult<T>>,
  options: InfiniteScrollOptions = {},
) => {
  const { threshold = 0.1, rootMargin = '20px', enabled = true } = options;

  const targetRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const handleIntersect = useCallback(
    async ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting && !isLoading && hasMore && enabled) {
        try {
          setIsLoading(true);
          const result = await loadMore(page);

          setHasMore(result.hasMore);
          setPage((prev) => prev + 1);
        } catch (error) {
          console.error('Failed to load more data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [loadMore, isLoading, hasMore, page, enabled],
  );

  useEffect(() => {
    const target = targetRef.current;
    if (!target || !enabled) return;

    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin,
    });

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersect, threshold, rootMargin, enabled]);

  const reset = useCallback(() => {
    setPage(1);
    setHasMore(true);
    setIsLoading(false);
  }, []);

  return {
    targetRef,
    isLoading,
    hasMore,
    page,
    reset,
  };
};
