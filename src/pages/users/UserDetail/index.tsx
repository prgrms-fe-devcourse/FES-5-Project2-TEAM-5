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
  const navigate = useNavigate();

  const { diaries, targetRef, isLoading, hasMore } = useUserDiaryLoader(slug, activeTabId, loading);
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
          {diaries.length > 0 && hasMore && <div ref={targetRef}>{isLoading && <Spinner />}</div>}
        </div>
      </section>
    </main>
  );
};
export default UserDetail;
