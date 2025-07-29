import S from './style.module.css';
import NextPageButton from "./components/NextPageButton";
import DiaryList from "./components/DiaryList";
import { useEffect, useState } from 'react';
import { useUserContext } from '@/shared/context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useDiaries } from './hooks/useDiaries';

function SelectDiary() {
  const { user, isAuth } = useUserContext();
  const { diaries, loading } = useDiaries(user?.id, isAuth);  // 훅 사용

  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedDiaryId, setSelectedDiaryId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (visibleCount > 3) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const handleNext = () => {
    if (!selectedDiaryId) return;

    navigate('/analysis/emotion-and-quest', {
      state: { diaryId: selectedDiaryId }, // 선택한 일기 ID 전달
    });
  };

  // --- 화면 렌더링 ---

  if (loading) {
    return (
      <main className={S.container}>
        <div className={S.spinner}></div>
      </main>
    );
  }

  if (!isAuth || !user) {
    return <main className={S.container}>로그인이 필요합니다.</main>;
  }

  if (!diaries.length) {
    return <main className={S.container}>작성한 일기가 없습니다.</main>;
  }

  const visibleDiaries = diaries.slice(0, visibleCount);
  const hasMore = visibleCount < diaries.length;

  return (
    <main className={S.container}>
      <section aria-label='일기 선택 안내' className={S.intro}>
        <h2>일기 선택</h2>
        <p>감정분석을 하고 싶은 일기를 선택해주세요.</p>
      </section>

      <div className={S.listWrapper}>
        <DiaryList diaries={visibleDiaries} onSelect={setSelectedDiaryId} />
      </div>

      {hasMore && (
        <button type="button" className={S.loadMore} onClick={handleLoadMore}>
          이전 일기 불러오기
        </button>
      )}

      <NextPageButton
        onClick={handleNext}
        disabled={!selectedDiaryId}
      />
    </main>
  );
}

export default SelectDiary;