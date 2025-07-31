import DiaryWeather from '@/shared/components/DiaryWeather';
import S from './style.module.css';
import DiaryRowCard from '@/shared/components/DiaryRowCard';
import { useEffect, useState } from 'react';
import { getUserCommentedDiaries, getUserDiaries, getUserLikedDiaries } from '@/shared/api/diary';
import { useNavigate, useParams } from 'react-router-dom';
import Tabs from './components/Tab';
import { getUserDataById } from '@/shared/api/user';
import UserInfoSection from '@/shared/components/UserInfoSection';
import { toastUtils } from '@/shared/components/Toast';
import type { DiaryRowEntity } from '@/shared/types/diary';
import type { Tables } from '@/shared/api/supabase/types';
import Spinner from '@/shared/components/Spinner';

const UserDetail = () => {
  const [diaries, setDiaries] = useState<DiaryRowEntity[]>([]);
  const [userInfo, setUserInfo] = useState<Tables<'users'> | null>(null);
  const { slug } = useParams<{ slug: string }>();
  const [activeTabId, setActiveTabId] = useState('diary');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiaries = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        setDiaries([]);
        const user = await getUserDataById(slug);
        if (!user) {
          navigate('/users');
          return;
        }

        let data: DiaryRowEntity[] = [];
        switch (activeTabId) {
          case 'diary':
            data = await getUserDiaries(slug);
            break;
          case 'like':
            data = await getUserLikedDiaries(slug);
            break;
          case 'comment':
            data = await getUserCommentedDiaries(slug);
            break;
          default:
            data = [];
        }
        const uniqueData = data.filter(
          (diary, index, self) => index === self.findIndex((d) => d.id === diary.id),
        );

        setUserInfo(user);
        setDiaries(uniqueData);
      } catch (error) {
        if (error instanceof Error)
          toastUtils.error({ title: '다이어리 정보 로드 실패', message: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, [activeTabId]);

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
              return <DiaryRowCard {...cardProps} key={`${activeTabId}-${diary.id}`} />;
            })}
          </ul>
        </div>
      </section>
    </main>
  );
};
export default UserDetail;
