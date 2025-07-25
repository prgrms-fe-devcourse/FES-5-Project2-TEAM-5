import DiaryBanner from './components/DiaryBanner';
import DiaryCalender from './components/DiaryCalender';
import DiaryEmotionChart from './components/DiaryEmotionChart';
import DiaryList from './components/DiaryList';
import DiaryPlant from './components/DiaryPlant';
import DiaryWeather from './components/DiaryWeather';
import S from './style.module.css';
import { BsPlusLg } from 'react-icons/bs';

function DiaryPage() {
  return (
    <main className={S.container}>
      {/* 날씨 연동 배너 이미지 영역 */}
      <DiaryWeather />

      {/* 일기 통계 영역 */}
      <section className={S.section02}>
        <h2 className="sr-only">일기 통계 영역</h2>
        <div className={S.inner}>
          {/* 캘린더 영역  */}
          <div className={S.calendar}>
            <h3>
              My emotional seed
              <button type="button">
                <BsPlusLg size={24} aria-hidden="true" />
                New Diary
              </button>
            </h3>
            <DiaryCalender />
          </div>
          {/* 식물, 차트 영역 */}
          <div className={S.stats}>
            {/* 식물 상태 */}
            <div className={S.plantGrowth}>
              <h3>My emotional record</h3>
              <DiaryPlant target={25} />
            </div>
            {/* 감정 차트 */}
            <DiaryEmotionChart data={[88, 61, 49, 37, 55, 72, 85]} />
          </div>
        </div>
      </section>

      {/* 일기 배너, 리스트 영역 */}
      <section className={S.section03}>
        <h2 className="sr-only">일기 배너 리스트 영역</h2>
        <div className={S.inner}>
          {/* 일기 작성 배너 */}
          <DiaryBanner />
          {/* 일기 리스트 */}
          <DiaryList />
        </div>
      </section>
    </main>
  );
}
export default DiaryPage;
