import DiaryWeather from '@/shared/components/DiaryWeather';
import S from './style.module.css';
import DiaryRowCard from '@/shared/components/DiaryRowCard';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Tabs from './components/Tab';
import { getUserDataById } from '@/shared/api/user';
import UserInfoSection from '@/shared/components/UserInfoSection';
import { toastUtils } from '@/shared/components/Toast';
import type { Tables } from '@/shared/api/supabase/types';
import Spinner from '@/shared/components/Spinner';
import { useUserDiaryLoader } from './hooks/useTabDiaryLoader';

const UserDetail = () => {
  const [userInfo, setUserInfo] = useState<Tables<'users'> | null>(null);
  const { slug } = useParams<{ slug: string }>();
  const [activeTabId, setActiveTabId] = useState('diary');
  const [loading, setLoading] = useState(true);
  const [lastSettledTabId, setLastSettledTabId] = useState(activeTabId);
  const navigate = useNavigate();

  const { diaries, targetRef, isLoading, hasMore, isInitialLoading, isTabChanging } =
    useUserDiaryLoader(slug, activeTabId, loading);

  useEffect(() => {
    if (!isInitialLoading && !isTabChanging) {
      setLastSettledTabId(activeTabId);
    }
  }, [isInitialLoading, isTabChanging, activeTabId]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const user = await getUserDataById(slug);
        if (!user) {
          navigate('/users');
          return;
        }
        setUserInfo(user);
      } catch (error) {
        if (error instanceof Error)
          toastUtils.error({ title: '사용자 정보 로드 실패', message: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [slug, navigate]);

  if (loading) {
    return (
      <main className={S.container}>
        <Spinner />
      </main>
    );
  }
  return (
    <main className={S.container}>
      <DiaryWeather />
      <UserInfoSection userInfo={userInfo} />
      <Tabs activeTabId={activeTabId} onTabChange={setActiveTabId} />
      <section className={S.section03}>
        <h2 className="sr-only">일기 배너 리스트 영역</h2>

        <div className={S.inner}>
          {isInitialLoading || isTabChanging ? (
            <div className={S.loadingSpinner}>
              <Spinner />
            </div>
          ) : (
            <>
              <ul className={S.diaryList}>
                {diaries.map((diary) => {
                  const cardProps = {
                    id: diary.id,
                    comments: diary.comments,
                    created_at: diary.created_at,
                    diary_hashtags: diary.diary_hashtags,
                    diary_image: diary.diary_image,
                    emotion_mains: diary.emotion_mains,
                    likes: diary.likes,
                    title: diary.title,
                    is_public: diary.is_public,
                  };
                  return <DiaryRowCard {...cardProps} key={diary.id} />;
                })}
              </ul>
              {diaries.length === 0 &&
                !isInitialLoading &&
                !isTabChanging &&
                lastSettledTabId === activeTabId && (
                  <div className={S.noDiaryState}>
                    <img
                      src="https://ttqedeydfvolnyrivpvg.supabase.co/storage/v1/object/public/emotions/icon_sad.svg"
                      alt="일기 없음 아이콘"
                      className={S.noDiaryIcon}
                    />
                    <p className={S.noResult} role="status">
                      {activeTabId === 'diary' && '아직 작성한 일기가 없습니다.'}
                      {activeTabId === 'like' && '아직 좋아요한 일기가 없습니다.'}
                      {activeTabId === 'comment' && '아직 댓글을 단 일기가 없습니다.'}
                    </p>
                  </div>
                )}
            </>
          )}
          {isLoading && hasMore && !isTabChanging && (
            <div className={S.loadingSpinner}>
              <Spinner />
            </div>
          )}
          <div ref={targetRef} className={S.infiniteScrollTrigger} aria-hidden="true" />
        </div>
      </section>
    </main>
  );
};
export default UserDetail;
