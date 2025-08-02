import S from './style.module.css';
import DiaryRowCard from '@/shared/components/DiaryRowCard';
import { useEffect, useTransition } from 'react';
import { toastUtils } from '@/shared/components/Toast';
import { useUserContext } from '@/shared/context/UserContext';
import Spinner from '@/shared/components/Spinner';
import { Link } from 'react-router-dom';
import { PATHS } from '@/shared/constants/path';
import { useDiaryLoader } from '@/shared/hooks/useDiaryLoader';

const DiarySection = () => {
  const { userInfo } = useUserContext();
  const [isPending, startTransition] = useTransition();

  const { diaries, loadDiaries, targetRef, isLoading, hasMore } = useDiaryLoader(
    userInfo,
    isPending,
  );

  useEffect(() => {
    startTransition(async () => {
      if (!userInfo) return;
      try {
        await loadDiaries(0);
      } catch (error) {
        if (error instanceof Error) {
          toastUtils.error({ title: '실패', message: error.message });
        }
      }
    });
  }, [userInfo]);

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
          <>
            {diaries.map((diary) => (
              <DiaryRowCard {...diary} key={diary.id} />
            ))}
            {isLoading && hasMore && (
              <div className={S.loadingSpinner}>
                <Spinner />
              </div>
            )}
            {hasMore && (
              <div ref={targetRef} className={S.infiniteScrollTrigger} aria-hidden="true" />
            )}
          </>
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
