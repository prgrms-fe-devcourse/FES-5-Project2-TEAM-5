import S from './style.module.css'
import NextPageButton from "./components/NextPageButton";
import DiaryList from "./components/DiaryList";
import { diaries } from '../dummyData';

function SelectDiary() {
  return (
    <main className={S.container}>
      <section aria-label='일기 선택 안내' className={S.intro}>
        <h2>일기 선택</h2>
        <p>감정분석을 하고 싶은 일기를 선택해주세요.</p>
      </section>
      <DiaryList diaries={diaries} />
      <NextPageButton />
    </main>
  )
}
export default SelectDiary