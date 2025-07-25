import { GrFormCheckmark } from 'react-icons/gr'
import S from './style.module.css'
import type { Diary } from '../../types';


function DiaryItem({ diary }: { diary: Diary }) {
  
  const { id, date, title, content } = diary;

  return (
    <label htmlFor={`diary-${id}`} className={S.diaryItem}>
      <input type="radio" name="diary" id={`diary-${id}`} className={S.radioBtn} />
      <GrFormCheckmark className={S.checkIcon} />
      <div className={S.textContent}>
        <p className={S.date}>{date}</p>
        <h3>{title}</h3>
        <p className={S.content}>{content}</p>
      </div>
    </label>
  )
}
export default DiaryItem