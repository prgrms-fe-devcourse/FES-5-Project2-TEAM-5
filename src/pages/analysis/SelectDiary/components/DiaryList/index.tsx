import S from './style.module.css'
import type { Database } from '@/shared/api/supabase/types';
import DiaryItem from '../DiaryItem/index'

type Diary = Database['public']['Tables']['diaries']['Row'];

interface Props {
  diaries: Diary[];
  onSelect: (id: string) => void;
}

function DiaryList({ diaries, onSelect }: Props) {
  return (
    <section aria-label='일기 목록' className={S.diaryList}>
      {
        diaries.map((diary)=>(
          <DiaryItem key={diary.id} diary={diary} onSelect={onSelect}/>
        ))
      }
    </section>
  )
}
export default DiaryList