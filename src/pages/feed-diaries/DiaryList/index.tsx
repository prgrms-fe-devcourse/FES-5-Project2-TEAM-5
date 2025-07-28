import S from './style.module.css';
import DiaryCard from './components/DiaryCard';
import Masonry from 'react-masonry-css';
import EmotionSelectBox from './components/EmotionSelectBox';
import SearchBox from './components/SearchBox';
import { useCallback, useEffect, useState } from 'react';
import { useDiariesSearch } from './hooks/useDiarySearch';
import type { Emotion } from './type/emotion';
import type { Diary } from './type/diary';
import { getAllEmotionMains } from '@/shared/api/emotionMain';
import { getAllDiariesLikesCount } from '@/shared/api/like';
import { getAllDiariesCommentsCount } from '@/shared/api/comment';
import { getAllDiaryData } from '@/shared/api/diary';
import { getAllUserData } from '@/shared/api/user';
import type { DbUser } from '@/pages/users/UserList/types/dbUser';

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
  const { filteredDiaries } = useDiariesSearch(diaries, searchTerm, selectedEmotions);

  useEffect(() => {
    const fetchDiaries = async () => {
      const [userData, diaryData, emotionData, likesCount, commentsCount] = await Promise.all([
        getAllUserData(),
        getAllDiaryData(),
        getAllEmotionMains(),
        getAllDiariesLikesCount(),
        getAllDiariesCommentsCount(),
      ]);
      setUsers(userData);
      setDiaries(diaryData);
      setMainEmotions(emotionData);
      setLikesCount(likesCount);
      setCommentsCount(commentsCount);
    };
    fetchDiaries();
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleFilter = useCallback((emotions: Emotion[]) => {
    setSelectedEmotions(emotions);
  }, []);

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
                      user={user}
                      diary={diary}
                      emotions={mainEmotions}
                      likesCount={likesCount[diary.id] || 0}
                      commentsCount={commentsCount[diary.id] || 0}
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
