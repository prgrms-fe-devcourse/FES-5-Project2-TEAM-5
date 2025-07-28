import S from './style.module.css';
import DiaryCardHeader from '../DiaryCardHeader';
import DiaryCardFooter from '../DiaryCardFooter';
import DiaryCardContent from '../DiaryCardContent';
import type { Diary } from '../../type/diary';
import type { Emotion } from '../../type/emotion';
import { useNavigate } from 'react-router-dom';
import type { DbUser } from '@/pages/users/UserList/types/dbUser';

interface Props {
  user: DbUser;
  diary: Diary;
  emotions: Emotion[];
  likesCount: number;
  commentsCount: number;
}

const DiaryCard = ({ user, diary, emotions, likesCount, commentsCount }: Props) => {
  const { created_at, emotion_main_id } = diary;
  const emotion = emotions.find((e) => e.id === emotion_main_id)!;
  const navigate = useNavigate();

  const handleDiaryDetail = () => {
    // 드래그 시 무시
    if (window.getSelection()?.toString()) return;
    const slug = diary.id;
    navigate(`/users/${slug}`);
  };

  return (
    <article className={S.card} onClick={handleDiaryDetail}>
      <DiaryCardHeader emotion={emotion} created_at={created_at} user={user} />
      <DiaryCardContent diary={diary} />
      <DiaryCardFooter likesCount={likesCount} commentsCount={commentsCount} />
    </article>
  );
};
export default DiaryCard;
