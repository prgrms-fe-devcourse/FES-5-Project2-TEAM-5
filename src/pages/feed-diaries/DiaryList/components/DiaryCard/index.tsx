import S from './style.module.css';
import DiaryCardHeader from '../DiaryCardHeader';
import DiaryCardFooter from '../DiaryCardFooter';
import DiaryCardContent from '../DiaryCardContent';
import type { Diary } from '../../type/diary';
import type { Emotion } from '../../type/emotion';

interface Props {
  diary: Diary;
  emotions: Emotion[];
  likesCount: number;
  commentsCount: number;
}

const DiaryCard = ({ diary, emotions, likesCount, commentsCount }: Props) => {
  const { created_at, emotion_main_id } = diary;
  const emotion = emotions.find((e) => e.id === emotion_main_id)!;
  return (
    <article className={S.card}>
      <DiaryCardHeader emotion={emotion} created_at={created_at} />
      <DiaryCardContent diary={diary} />
      <DiaryCardFooter likesCount={likesCount} commentsCount={commentsCount} />
    </article>
  );
};
export default DiaryCard;
