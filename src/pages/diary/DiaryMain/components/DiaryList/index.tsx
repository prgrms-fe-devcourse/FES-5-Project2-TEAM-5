import S from './style.module.css';
import DiaryRowCard from '@/shared/components/DiaryRowCard';
import type { DiaryRowEntity } from '@/shared/types/diary';

type Props = {
  diaries: DiaryRowEntity[];
};

const DiaryList = ({ diaries }: Props) => {
  if (!diaries.length) return null;
  return (
    <ul className={S.diaryList}>
      {diaries.map((diary) => {
        return <DiaryRowCard {...diary} key={diary.id} />;
      })}
    </ul>
  );
};

export default DiaryList;
