import S from './DiaryList.module.css'
import type { Diary } from '../types'
import DiaryItem from './DiaryItem'

function DiaryList({ diaries }: { diaries: Diary[] }) {
  return (
    <section aria-label='일기 목록' className={S.diaryList}>
      {
        diaries.map((diary)=>(
          <DiaryItem key={diary.id} diary={diary}/>
        ))
      }
      <button type='button' className={S.loadMore}>이전 일기 불러오기</button>
    </section>
  )
}
export default DiaryList