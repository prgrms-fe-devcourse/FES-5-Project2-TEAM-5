import { useCallback, useState } from 'react';
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

  const { diaryList, loading } = useDiaryData(user?.id ?? null, selectedDate, currentCalendarMonth);

  const handleMonthChange = useCallback((newDate: Date) => {
    setCurrentCalendarMonth(newDate);
  }, []);

  const { monthEntries, currentMonthDiaryCount } = useMonthlyDiaryData(
    user?.id ?? null,
    selectedDate,
  );
  const { emotionMainsList } = useEmotionData();
  const { emotionStatsData } = useEmotionStats(user?.id ?? null, selectedDate, emotionMainsList);

  // 계산된 값들
  const totalDaysInSelectedMonth = getDaysInMonth(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
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

  return (
    <main className={S.container}>
      {/* 날씨 영역 */}
      <DiaryWeather />

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
              onMonthChange={handleMonthChange}
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
    </main>
  );
};

export default DiaryPage;
