import S from './style.module.css';
import DiaryCardHeader from '../DiaryCardHeader';
import DiaryCardFooter from '../DiaryCardFooter';
import DiaryCardContent from '../DiaryCardContent';
import { useNavigate } from 'react-router-dom';
import type { DbUser } from '@/shared/types/dbUser';
import type { Diary } from '@/shared/types/diary';
import type { Emotion } from '@/shared/types/emotion';

interface Props {
  user: DbUser;
  diary: Diary;
  emotions: Emotion[];
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

const DiaryCard = ({ user, diary, emotions, likesCount, commentsCount, isLiked }: Props) => {
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
      <DiaryCardFooter likesCount={likesCount} isLiked={isLiked} commentsCount={commentsCount} />
    </article>
  );
};
export default DiaryCard;
