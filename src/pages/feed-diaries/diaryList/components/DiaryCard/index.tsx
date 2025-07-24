import S from './style.module.css';
import DiaryCardHeader from '../DiaryCardHeader';
import DiaryCardFooter from '../DiaryCardFooter';
import DiaryCardContext from '../DiaryCardContent';
import type { Diary } from '../..';

interface Props {
  diary: Diary;
  emotions: Emotion[];
}

interface Emotion {
  id: number;
  name: string;
  URL: string;
}

const DiaryCard = ({ diary, emotions }: Props) => {
  const { created_at, emotion_main_id } = diary;
  const emotion = emotions.find((e) => e.id === emotion_main_id);
  return (
    <article className={S.card}>
      {emotion && <DiaryCardHeader emotion={emotion} created_at={created_at} />}
      <DiaryCardContext diary={diary} />
      <DiaryCardFooter />
    </article>
  );
};
export default DiaryCard;
