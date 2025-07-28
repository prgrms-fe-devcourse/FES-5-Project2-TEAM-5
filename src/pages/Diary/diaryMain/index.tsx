import DiaryWeather from '@/shared/components/DiaryWeather';
import DiaryBanner from './components/DiaryBanner';
import DiaryCalendar from './components/DiaryCalendar';
import DiaryEmotionChart from './components/DiaryEmotionChart';
import DiaryList from './components/DiaryList';
import DiaryPlant from './components/DiaryPlant';
import S from './style.module.css';
import { BsPlusLg } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { DiaryRowEntity } from '@/shared/types/diary';
import supabase from '@/shared/api/supabase/client';
import { toastUtils } from '@/shared/components/Toast';
import { transformDiaryData } from '@/shared/utils/formatSupabase';
import { useUserContext } from '@/shared/context/UserContext';

type MonthEntry = {
  created_at: string;
};

const DiaryPage = () => {
  const { user } = useUserContext();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [diaryList, setDiaryList] = useState<DiaryRowEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [monthEntries, setMonthEntries] = useState<MonthEntry[]>([]);
  const navigate = useNavigate();

  // YYYY-MM-DD 형식으로 로컬 날짜 문자열을 반환하는 함수
  const getLocalDateString = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // 선택된 날짜의 일기 조회 (user + 날짜)
  useEffect(() => {
    const fetchDiaryForDate = async () => {
      if (!user?.id || !selectedDate) {
        setDiaryList([]);
        return;
      }
      setLoading(true);

      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const startOfDayUTC = startOfDay.toISOString();

      const startOfNextDay = new Date(selectedDate);
      startOfNextDay.setDate(startOfNextDay.getDate() + 1);
      startOfNextDay.setHours(0, 0, 0, 0);
      const startOfNextDayUTC = startOfNextDay.toISOString();

      const { data, error } = await supabase
        .from('diaries')
        .select(
          `
          id, 
          title, 
          created_at, 
          is_public, 
          diary_image,
          emotion_mains(name, icon_url),
          diary_hashtags(
            hashtags(id, name)
          )
        `,
        )
        .eq('user_id', user.id)
        .eq('is_drafted', false)
        .gte('created_at', startOfDayUTC)
        .lt('created_at', startOfNextDayUTC);

      if (error) {
        toastUtils.error({ title: '실패', message: '해당 날짜 일기 목록 로드에 실패했습니다.' });
        setDiaryList([]);
      } else {
        if (data && Array.isArray(data)) {
          const diariesWithCounts = await Promise.all(
            data.map(async (diary) => {
              const { count: likesCount } = await supabase
                .from('likes')
                .select('id', { count: 'exact', head: true })
                .eq('diary_id', diary.id);

              const { count: commentsCount } = await supabase
                .from('comments')
                .select('id', { count: 'exact', head: true })
                .eq('diary_id', diary.id);

              return {
                ...diary,
                likes: [{ count: likesCount || 0 }],
                comments: [{ count: commentsCount || 0 }],
              };
            }),
          );

          const transformedData = transformDiaryData(diariesWithCounts);
          setDiaryList(transformedData || []);
        } else {
          setDiaryList([]);
        }
      }
      setLoading(false);
    };

    fetchDiaryForDate();
  }, [user?.id, selectedDate]);

  // 월별 전체 일기 조회 (캘린더 아이콘 표시용)
  useEffect(() => {
    if (!user?.id) {
      setMonthEntries([]);
      return;
    }

    const fetchMonthEntries = async () => {
      const firstDayOfSelectedMonth = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1,
      );
      firstDayOfSelectedMonth.setHours(0, 0, 0, 0);
      const queryStartUTC = firstDayOfSelectedMonth.toISOString();

      const firstDayOfNextMonth = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        1,
      );
      firstDayOfNextMonth.setHours(0, 0, 0, 0);
      const queryEndUTC = firstDayOfNextMonth.toISOString();

      const { data, error } = await supabase
        .from('diaries')
        .select('created_at')
        .eq('user_id', user.id)
        .eq('is_drafted', false)
        .gte('created_at', queryStartUTC)
        .lt('created_at', queryEndUTC);

      if (error) {
        console.error('월별 일기 항목 로드 실패:', error);
        setMonthEntries([]);
      } else {
        if (data && Array.isArray(data)) {
          setMonthEntries(data as MonthEntry[]);
        } else {
          setMonthEntries([]);
        }
      }
    };

    fetchMonthEntries();
  }, [selectedDate, user?.id]);

  const handleNewDiaryClick = () => {
    const dateStr = getLocalDateString(selectedDate); // 'YYYY-MM-DD' 형식의 로컬 날짜 전달
    navigate('/diary/form', { state: { date: dateStr } });
  };

  return (
    <main className={S.container}>
      {/* 날씨 영역 */}
      <div className={S.banner}>
        <DiaryWeather />
      </div>

      {/* 일기 통계 영역 */}
      <section className={S.section02}>
        <h2 className="sr-only">일기 통계 영역</h2>
        <div className={S.inner}>
          <div className={S.calendar}>
            <h3>
              My emotional seed
              <button type="button" onClick={handleNewDiaryClick}>
                <BsPlusLg size={24} aria-hidden="true" />
                New Diary
              </button>
            </h3>
            <DiaryCalendar
              userId={user?.id ?? null}
              date={selectedDate}
              onDateChange={setSelectedDate}
              entries={monthEntries}
            />
          </div>
          <div className={S.stats}>
            <div className={S.plantGrowth}>
              <h3>My emotional record</h3>
              <DiaryPlant target={25} />
            </div>
            <DiaryEmotionChart data={[88, 61, 49, 37, 55, 72, 85]} />
          </div>
        </div>
      </section>

      {/* 일기 배너 및 리스트 영역 */}
      <section className={S.section03}>
        <h2 className="sr-only">일기 배너 리스트 영역</h2>
        <div className={S.inner}>
          {loading ? (
            <div className={S.spinner_wrap}>
              <span className={S.spinner}></span>
            </div>
          ) : diaryList.length > 0 ? (
            <DiaryList diaries={diaryList} />
          ) : (
            <DiaryBanner onNewDiaryClick={handleNewDiaryClick} />
          )}
        </div>
      </section>
    </main>
  );
};

export default DiaryPage;
