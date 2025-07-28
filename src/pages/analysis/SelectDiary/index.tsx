import S from './style.module.css';
import NextPageButton from "./components/NextPageButton";
import DiaryList from "./components/DiaryList";
import { useEffect, useState } from 'react';
import supabase from '@/shared/api/supabase/client';
import { useUserContext } from '@/shared/context/UserContext';
import type { Database } from '@/shared/api/supabase/types';

type Diary = Database['public']['Tables']['diaries']['Row'];

function SelectDiary() {
  const { user, isAuth } = useUserContext();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(true);
  const [selectedDiaryId, setSelectedDiaryId] = useState<string | null>(null);

  const isSessionUnknown = user === null && !isAuth && loading; // 세션 확인 전인지 판별

  useEffect(() => {

    if (!isAuth || !user) {
      setDiaries([]);  // 로그인 안 된 경우
      setLoading(false);
      return;
    }

    if (isSessionUnknown) return; // 세션 확인 전

    // 일기 데이터 있으면 스피너 x
    if (diaries.length > 0) {
      setLoading(false);
      return;
    }

    const fetchDiaries = async () => {
      setLoading(true);
      const start = Date.now(); // 로딩 시작 시간

      const { data, error } = await supabase
        .from('diaries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      const loadTime = Date.now() - start;
      const minDelay = 700; // 스피너 최소 시간
      const delay = loadTime < minDelay ? (minDelay - loadTime) : 0;

      setTimeout(() => {
        if (error) {
          console.error('Error fetching diaries:', error);
          setDiaries([]);
        } else {
          setDiaries((data as Diary[]) || []);
        }
        setLoading(false);
      }, delay);
    };

    fetchDiaries();
  }, [user, isAuth, isSessionUnknown]);

  useEffect(() => {
    if (visibleCount > 3) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [visibleCount]);

  // --- 화면 렌더링 ---

  // 세션 확인 전 스피너만 표시
  if (isSessionUnknown) {
    return (
      <main className={S.container}>
        <div className={S.spinner}></div>
      </main>
    );
  }

  // diary 로딩 중
  if(loading) {
    return (
      <main className={S.container} >
        <div className={S.spinner}></div>
      </main>
    );
  }

  // 로그인 안 됐을 때
  if (!isAuth || !user) {
    return <main className={S.container}>로그인이 필요합니다.</main>;
  }

  // 일기 없을 때
  if (!diaries.length) {
    return <main className={S.container}>작성한 일기가 없습니다.</main>;
  }

  
  const visibleDiaries = diaries.slice(0, visibleCount); // 현재 보이는 일기
  const hasMore = visibleCount < diaries.length; // 일기가 더 있는지

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  
  return (
    <main className={S.container}>
      <section aria-label='일기 선택 안내' className={S.intro}>
        <h2>일기 선택</h2>
        <p>감정분석을 하고 싶은 일기를 선택해주세요.</p>
      </section>

      <div className={S.listWrapper}>
        <DiaryList
          diaries={visibleDiaries}
          onSelect={setSelectedDiaryId}
        />
      </div>

      {hasMore && (
        <button type="button" className={S.loadMore} onClick={handleLoadMore}>
          이전 일기 불러오기
        </button>
      )}

      <NextPageButton disabled={!selectedDiaryId}/>
    </main>
  );
}

export default SelectDiary;