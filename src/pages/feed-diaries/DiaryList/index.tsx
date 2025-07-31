import S from './style.module.css';
import DiaryCard from './components/DiaryCard';
import Masonry from 'react-masonry-css';
import EmotionSelectBox from './components/EmotionSelectBox';
import SearchBox from './components/SearchBox';
import { useCallback, useEffect, useState } from 'react';
import { useDiariesSearch } from './hooks/useDiarySearch';
import type { Emotion } from '../../../shared/types/emotion';
import { getAllEmotionMains } from '@/shared/api/emotionMain';
import { getAllDiariesLikesData } from '@/shared/api/like';
import { getAllDiariesCommentsCount } from '@/shared/api/comment';
import { getAllDiaryData } from '@/shared/api/diary';
import { getAllUserData } from '@/shared/api/user';
import type { DbUser } from '@/shared/types/dbUser';
import type { Diary } from '@/shared/types/diary';
import { toastUtils } from '@/shared/components/Toast';
import { useUserContext } from '@/shared/context/UserContext';
import Spinner from '@/shared/components/Spinner';

const breakpointColumns = {
  default: 2,
  768: 1,
};

const DiaryList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>([]);
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});
  const [commentsCount, setCommentsCount] = useState<Record<string, number>>({});
  const [users, setUsers] = useState<DbUser[]>([]);
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [mainEmotions, setMainEmotions] = useState<Emotion[]>([]);
  const [currentUserLikes, setCurrentUserLikes] = useState<Set<string>>(new Set());
  const { filteredDiaries } = useDiariesSearch(diaries, searchTerm, selectedEmotions);
  const [loading, setLoading] = useState(true);
  const { user, isAuth } = useUserContext();
  const currentUserId = user?.id || null;

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        setLoading(true);
        const [userData, diaryData, emotionData, likesData, commentsCount] = await Promise.all([
          getAllUserData(),
          getAllDiaryData(),
          getAllEmotionMains(),
          getAllDiariesLikesData(currentUserId),
          getAllDiariesCommentsCount(),
        ]);
        setUsers(userData);
        setDiaries(diaryData);
        setMainEmotions(emotionData);
        setLikesCount(likesData.likesCount);
        setCommentsCount(commentsCount);
        setCurrentUserLikes(likesData.userLikes);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        toastUtils.error({ title: '실패', message: '예상하지 못한 에러 발생' });
      } finally {
        setLoading(false);
      }
    };
    fetchDiaries();
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleFilter = useCallback((emotions: Emotion[]) => {
    setSelectedEmotions(emotions);
  }, []);

  const handleLikeUpdate = useCallback((diaryId: string, isLiked: boolean, count: number) => {
    if (!isAuth || !user) {
      toastUtils.info({
        title: '로그인 필요',
        message: '좋아요를 누르려면 로그인해주세요.',
      });
    }
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

  if (loading) {
    return (
      <main className={S.container}>
        <Spinner />
      </main>
    );
  }
  return (
    <main className={S.container}>
      <h2 className="sr-only">전체 사용자 일기 목록</h2>
      <section className={S.searchSection}>
        <SearchBox onSearch={handleSearch} />
        <EmotionSelectBox emotions={mainEmotions} onFilter={handleFilter} />
      </section>

      <section aria-label="일기 목록" className={S.diariesSection}>
        {filteredDiaries.length <= 0 ? (
          <p className={S.noResult} role="status">
            검색 결과가 없습니다.
          </p>
        ) : (
          <ul className={S.diaryList}>
            <Masonry
              breakpointCols={breakpointColumns}
              className={S.masonryGrid}
              columnClassName={S.masonryColumn}
            >
              {filteredDiaries.map((diary) => {
                const user = users.find((u) => u.id === diary.user_id);
                if (!user) return null;
                return (
                  <li key={diary.id}>
                    <DiaryCard
                      currentUser={currentUserId || ''}
                      user={user}
                      diary={diary}
                      emotions={mainEmotions}
                      likesCount={likesCount[diary.id] || 0}
                      commentsCount={commentsCount[diary.id] || 0}
                      isLiked={currentUserLikes.has(diary.id)}
                      onLikeUpdate={handleLikeUpdate}
                    />
                  </li>
                );
              })}
            </Masonry>
          </ul>
        )}
      </section>
    </main>
  );
};
export default DiaryList;
