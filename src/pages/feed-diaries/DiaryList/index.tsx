import S from './style.module.css';
import DiaryCard from './components/DiaryCard';
import Masonry from 'react-masonry-css';
import EmotionSelectBox from './components/EmotionSelectBox';
import SearchBox from './components/SearchBox';
import { useCallback, useState } from 'react';
import type { Emotion } from '../../../shared/types/emotion';
import { toastUtils } from '@/shared/components/Toast';
import { useUserContext } from '@/shared/context/UserContext';
import Spinner from '@/shared/components/Spinner';
import { useDiaryListLoader } from './hooks/useDiaryListLoader';

const breakpointColumns = {
  default: 2,
  768: 1,
};

const DiaryList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>([]);
  const { user, isAuth } = useUserContext();
  const currentUserId = user?.id || null;

  const {
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
    handleLikeUpdate: updateLike,
  } = useDiaryListLoader(currentUserId, searchTerm, selectedEmotions);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleFilter = useCallback((emotions: Emotion[]) => {
    setSelectedEmotions(emotions);
  }, []);

  const handleLikeUpdate = useCallback(
    (diaryId: string, isLiked: boolean, count: number) => {
      if (!isAuth || !user) {
        toastUtils.info({
          title: '로그인 필요',
          message: '좋아요를 누르려면 로그인해주세요.',
        });
        return;
      }
      updateLike(diaryId, isLiked, count);
    },
    [isAuth, user, updateLike],
  );

  if (initialLoading) {
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
        {isLoading ? (
          <Spinner />
        ) : diaries.length <= 0 ? (
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
              {diaries.map((diary) => {
                const user = users.find((u) => u.id === diary.user_id);
                if (!user) return null;
                return (
                  <li key={diary.id}>
                    <DiaryCard
                      currentUser={currentUserId || ''}
                      user={user}
                      diary={diary}
                      emotions={mainEmotions}
                      hashtags={hashtagsData[diary.id] || []}
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
        {hasMore && <div ref={targetRef}>{isLoading && <Spinner />}</div>}
      </section>
    </main>
  );
};

export default DiaryList;
