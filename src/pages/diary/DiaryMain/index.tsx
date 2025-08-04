import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsPlusLg } from 'react-icons/bs';

import DiaryWeather from '@/shared/components/DiaryWeather';
import DiaryBanner from './components/DiaryBanner';
import DiaryCalendar from './components/DiaryCalendar';
import DiaryEmotionChart from './components/DiaryEmotionChart';
import DiaryList from './components/DiaryList';
import DiaryPlant from './components/DiaryPlant';

import { useUserContext } from '@/shared/context/UserContext';

import { getLocalDateString, getDaysInMonth } from '@/shared/utils/dateUtils';

import S from './style.module.css';
import { useDiaryData } from './hooks/useDiaryData';
import { useMonthlyDiaryData } from './hooks/useMonthlyDiaryData';
import { useEmotionData } from './hooks/useEmotionData';
import { useEmotionStats } from './hooks/useEmotionStats';
import {
  calculateDiaryCompletionPercentage,
  calculateEmotionPercentages,
} from './utils/diaryCalculations';
import Spinner from '@/shared/components/Spinner';

const DiaryPage = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isPageReady, setIsPageReady] = useState(false);

  // 선택된 날짜의 일기 목록 (일기 리스트용)
  const { diaryList, loading } = useDiaryData(user?.id ?? null, selectedDate);

  // 달력에 표시할 월별 일기 데이터 (달력 아이콘용)
  const {
    monthEntries,
    currentMonthDiaryCount,
    loading: monthLoading,
  } = useMonthlyDiaryData(user?.id ?? null, currentCalendarMonth, refreshTrigger);

  const { emotionMainsList } = useEmotionData();

  // 감정 차트용 데이터 (달력 월과 연동)
  const { emotionStatsData } = useEmotionStats(
    user?.id ?? null,
    selectedDate,
    emotionMainsList,
    currentCalendarMonth,
  );

  const handleMonthChange = useCallback((newDate: Date) => {
    setCurrentCalendarMonth(newDate);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleDateChange = useCallback((newDate: Date) => {
    setSelectedDate(newDate);
  }, []);

  // 계산된 값들
  const totalDaysInSelectedMonth = getDaysInMonth(
    currentCalendarMonth.getFullYear(),
    currentCalendarMonth.getMonth(),
  );

  const diaryCompletionPercentage = calculateDiaryCompletionPercentage(
    currentMonthDiaryCount,
    totalDaysInSelectedMonth,
  );

  const emotionStatsPercentage = calculateEmotionPercentages(emotionStatsData);

  const handleNewDiaryClick = () => {
    const dateStr = getLocalDateString(selectedDate);
    navigate('/diary/form', { state: { date: dateStr } });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className={S.container}>
      {/* 날씨 영역 */}
      <DiaryWeather />

      {/* 일기 통계 영역 */}
      {!isPageReady ? (
        <div className={S.spinner_wrap}>
          <Spinner />
        </div>
      ) : (
        <>
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
                  onDateChange={handleDateChange}
                  entries={monthEntries}
                  onMonthChange={handleMonthChange}
                  loading={monthLoading}
                />
              </div>

              <div className={S.stats}>
                <div className={S.plantGrowth}>
                  <h3>My emotional record</h3>
                  <DiaryPlant
                    value={diaryCompletionPercentage}
                    currentPlantLevel={currentMonthDiaryCount}
                  />
                </div>

                {emotionMainsList.length > 0 && (
                  <DiaryEmotionChart
                    data={emotionStatsPercentage}
                    emotionLabels={emotionMainsList.map((e) => e.name)}
                    emotionImages={emotionMainsList.map((e) => e.icon_url)}
                  />
                )}
              </div>
            </div>
          </section>

          {/* 일기 배너 및 리스트 영역 */}
          <section className={S.section03}>
            <h2 className="sr-only">일기 배너 리스트 영역</h2>
            <div className={S.inner}>
              {loading ? (
                <div className={S.spinner_wrap}>
                  <Spinner />
                </div>
              ) : diaryList.length > 0 ? (
                <DiaryList diaries={diaryList} />
              ) : (
                <DiaryBanner onNewDiaryClick={handleNewDiaryClick} />
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default DiaryPage;
