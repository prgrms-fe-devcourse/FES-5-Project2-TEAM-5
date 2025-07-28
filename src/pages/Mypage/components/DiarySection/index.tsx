import S from './style.module.css';
import DiaryRowCard from '@/shared/components/DiaryRowCard';
import { type DiaryRowEntity } from '@/shared/types/diary';
import { useEffect, useState } from 'react';
import { toastUtils } from '@/shared/components/Toast';
import { getDiariesById } from '@/shared/api/diary';
import { useUserContext } from '@/shared/context/UserContext';

const DiarySection = () => {
  const { userInfo } = useUserContext();
  const [diaries, setDiaries] = useState<DiaryRowEntity[]>([]);

  useEffect(() => {
    const fetchDiary = async () => {
      if (!userInfo) return;
      try {
        const data = await getDiariesById(userInfo.id);
        setDiaries(data);
      } catch (error) {
        if (error instanceof Error) {
          toastUtils.error({ title: '실패', message: error.message });
        }
      }
    };
    fetchDiary();
  }, []);

  return (
    <section className={S.contents}>
      <h2 className="sr-only">작성한 일기 목록</h2>
      <ul className={S.diaryList}>
        {diaries && diaries.map((diary) => <DiaryRowCard {...diary} key={diary.id} />)}
      </ul>
    </section>
  );
};
export default DiarySection;
