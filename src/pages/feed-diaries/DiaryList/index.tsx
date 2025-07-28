import S from './style.module.css';
import DiaryCard from './components/DiaryCard';
import Masonry from 'react-masonry-css';
import EmotionSelectBox from './components/EmotionSelectBox';
import SearchBox from './components/SearchBox';
import { useCallback, useEffect, useState } from 'react';
import { useDiariesSearch } from './hooks/useDiarySearch';
import type { Emotion } from './type/emotion';
import { getAllDiaryData } from './utils/getAllDiaryData';
import type { Diary } from './type/diary';
import { getAllEmotionMains } from '@/shared/api/emotionMain';
import { getAllDiariesLikesCount } from '@/shared/api/like';
import { getAllDiariesCommentsCount } from '@/shared/api/comment';

const breakpointColumns = {
  default: 2,
  768: 1,
};

const DiaryList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>([]);
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});
  const [commentsCount, setCommentsCount] = useState<Record<string, number>>({});
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [mainEmotions, setMainEmotions] = useState<Emotion[]>([]);
  const { filteredDiaries } = useDiariesSearch(diaries, searchTerm, selectedEmotions);

  useEffect(() => {
    const fetchDiaries = async () => {
      const [diaryData, emotionData, likesCount] = await Promise.all([
        getAllDiaryData(),
        getAllEmotionMains(),
        getAllDiariesLikesCount(),
        getAllDiariesCommentsCount(),
      ]);
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
              {filteredDiaries.map((diary) => (
                <li key={diary.id}>
                  <DiaryCard
                    diary={diary}
                    emotions={mainEmotions}
                    likesCount={likesCount[diary.id] || 0}
                    commentsCount={commentsCount[diary.id] || 0}
                  />
                </li>
              ))}
            </Masonry>
          </ul>
        )}
      </section>
    </main>
  );
};
export default DiaryList;
