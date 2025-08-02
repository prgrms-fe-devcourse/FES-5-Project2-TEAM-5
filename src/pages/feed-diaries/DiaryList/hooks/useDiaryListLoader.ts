import { useState, useEffect, useCallback } from 'react';
import type { DbUser } from '@/shared/types/dbUser';
import type { Diary } from '@/shared/types/diary';
import type { Emotion } from '@/shared/types/emotion';
import type { Hashtag } from '@/shared/types/hashtag';
import { getAllEmotionMains } from '@/shared/api/emotionMain';
import { getAllDiariesLikesDataByPage } from '@/shared/api/like';
import { getAllDiariesCommentsCountByPage } from '@/shared/api/comment';
import { getAllDiaryDataByPage } from '@/shared/api/diary';
import { getAllUser } from '@/shared/api/user';
import { getAllHashtagsDataByPage } from '@/shared/api/hashtag';
import { toastUtils } from '@/shared/components/Toast';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';

export const useDiaryListLoader = (
  currentUserId: string | null,
  searchTerm: string,
  selectedEmotions: Emotion[],
) => {
  const [users, setUsers] = useState<DbUser[]>([]);
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [mainEmotions, setMainEmotions] = useState<Emotion[]>([]);
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});
  const [commentsCount, setCommentsCount] = useState<Record<string, number>>({});
  const [hashtagsData, setHashtagsData] = useState<Record<string, Hashtag[]>>({});
  const [currentUserLikes, setCurrentUserLikes] = useState<Set<string>>(new Set());
  const [initialLoading, setInitialLoading] = useState(true);

  // 기본 데이터 로드 (사용자, 감정)
  useEffect(() => {
    const fetchBaseData = async () => {
      try {
        const [userData, emotionData] = await Promise.all([getAllUser(), getAllEmotionMains()]);
        setUsers(userData);
        setMainEmotions(emotionData);
      } catch (error) {
        toastUtils.error({ title: '실패', message: '기본 데이터 로딩에 실패했습니다' });
      }
    };
    fetchBaseData();
  }, []);

  const loadDiaries = useCallback(
    async (page: number) => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      try {
        // useInfiniteScroll page=1부터 시작
        const apiPage = page;
        const limit = 10;

        // 검색/필터 조건 설정
        const filters: {
          search?: string;
          emotions?: number[];
        } = {};

        if (searchTerm.trim()) {
          filters.search = searchTerm.trim();
        }

        if (selectedEmotions.length > 0) {
          filters.emotions = selectedEmotions.map((emotion) => Number(emotion.id));
        }

        const diaryData = await getAllDiaryDataByPage(apiPage, limit, filters);

        if (!Array.isArray(diaryData)) {
          return { data: [], hasMore: false };
        }

        if (diaryData.length > 0) {
          const diaryIds = diaryData.map((diary) => diary.id);
          const [likesData, commentsData, hashtagsDataResult] = await Promise.all([
            getAllDiariesLikesDataByPage(currentUserId, diaryIds),
            getAllDiariesCommentsCountByPage(diaryIds),
            getAllHashtagsDataByPage(diaryIds),
          ]);

          // 좋아요, 댓글, 해시태그 업데이트
          setLikesCount((prev) => ({ ...prev, ...likesData.likesCount }));
          setCommentsCount((prev) => ({ ...prev, ...commentsData }));
          setHashtagsData((prev) => ({ ...prev, ...hashtagsDataResult }));
          setCurrentUserLikes((prev) => new Set([...prev, ...likesData.userLikes]));
        }

        // 다이어리 데이터 업데이트
        setDiaries((prev) => {
          if (page === 1) {
            return diaryData;
          }

          const combined = [...prev, ...diaryData];
          const filtered = combined.filter(
            (diary, index, self) => index === self.findIndex((d) => d.id === diary.id),
          );
          return filtered;
        });

        const hasMore = diaryData.length < limit ? false : true;

        return {
          data: diaryData,
          hasMore: hasMore,
        };
      } catch (error) {
        toastUtils.error({ title: '실패', message: '다이어리 로딩에 실패했습니다' });
        return { data: [], hasMore: false };
      }
    },
    [currentUserId, searchTerm, selectedEmotions],
  );

  const { targetRef, isLoading, hasMore, reset } = useInfiniteScroll(loadDiaries, {
    enabled: !initialLoading,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (users.length > 0 && mainEmotions.length > 0 && initialLoading) {
      setInitialLoading(false);
    }
  }, [users.length, mainEmotions.length, initialLoading]);

  // 검색어나 감정이 변경되면 리셋
  useEffect(() => {
    if (!initialLoading) {
      // 상태 초기화
      setDiaries([]);
      setLikesCount({});
      setCommentsCount({});
      setHashtagsData({});
      setCurrentUserLikes(new Set());
      reset();
    }
  }, [searchTerm, selectedEmotions, reset, initialLoading]);

  const handleLikeUpdate = useCallback((diaryId: string, isLiked: boolean, count: number) => {
    setLikesCount((prev) => ({ ...prev, [diaryId]: count }));

    setCurrentUserLikes((prev) => {
      const updateLikes = new Set(prev);
      if (isLiked) {
        updateLikes.add(diaryId);
      } else {
        updateLikes.delete(diaryId);
      }
      return updateLikes;
    });
  }, []);

  return {
    users,
    diaries,
    mainEmotions,
    likesCount,
    commentsCount,
    hashtagsData,
    currentUserLikes,
    initialLoading,
    isLoading,
    hasMore,
    targetRef,
    handleLikeUpdate,
  };
};
