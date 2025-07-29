import S from './style.module.css';
import DiaryRowCard from '@/shared/components/DiaryRowCard';
import { type DiaryRowEntity } from '@/shared/types/diary';
import { useEffect, useState, useTransition } from 'react';
import { toastUtils } from '@/shared/components/Toast';
import { getDiariesById } from '@/shared/api/diary';
import { useUserContext } from '@/shared/context/UserContext';
import Spinner from '@/shared/components/Spinner';
import { Link } from 'react-router-dom';
import { PATHS } from '@/shared/constants/path';

const DiarySection = () => {
  const { userInfo } = useUserContext();
  const [diaries, setDiaries] = useState<DiaryRowEntity[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      if (!userInfo) return;
      startTransition(() => {});
      try {
        const data = await getDiariesById(userInfo.id);
        setDiaries(data);
      } catch (error) {
        if (error instanceof Error) {
          toastUtils.error({ title: '실패', message: error.message });
        }
      }
    });
  }, []);

  if (isPending) {
    return (
      <section className={S.contents}>
        <h2 className="sr-only">작성한 일기 목록</h2>
        <ul className={S.diaryList}>
          <Spinner />
        </ul>
      </section>
    );
  }

  return (
    <section className={S.contents}>
      <h2 className="sr-only">작성한 일기 목록</h2>
      <ul className={S.diaryList}>
        {diaries.length > 0 ? (
          diaries.map((diary) => <DiaryRowCard {...diary} key={diary.id} />)
        ) : (
          <div className={S.emptySection}>
            <span>아직 작성한 일기가 없어요...</span>
            <Link to={PATHS.DIARY} role="button" aria-label="일기 작성하러 가기">
              일기 작성하러 가기
            </Link>
          </div>
        )}
      </ul>
    </section>
  );
};
export default DiarySection;
