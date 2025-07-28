import { GrFormCheckmark } from 'react-icons/gr'
import S from './style.module.css'
import type { Database } from '@/shared/api/supabase/types';


type Diary = Database['public']['Tables']['diaries']['Row'];

function truncateText(text: string, limit: number) {
  return text.length > limit ? text.slice(0, limit) + '...' : text;
}


function DiaryItem({ diary }: { diary: Diary }) {
  
  const { id, created_at, title, content } = diary;

  const dateObj = new Date(created_at);
  const formattedDate = `${dateObj.getFullYear()}년 ${String(dateObj.getMonth() + 1).padStart(2, '0')}월 ${String(dateObj.getDate()).padStart(2, '0')}일`;

  return (
    <label htmlFor={`diary-${id}`} className={S.diaryItem}>
      <input type="radio" name="diary" id={`diary-${id}`} className={S.radioBtn} />
      <GrFormCheckmark className={S.checkIcon} />
      <div className={S.textContent}>
        <p className={S.date}>{formattedDate}</p>
        <h3>{title}</h3>
        <p className={S.content}>{truncateText(content, 130)}</p>
      </div>
    </label>
  )
}
export default DiaryItem