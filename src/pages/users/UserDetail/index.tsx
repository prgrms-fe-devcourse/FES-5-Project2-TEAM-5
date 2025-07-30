import DiaryWeather from '@/shared/components/DiaryWeather';
import S from './style.module.css';
import DiaryRowCard from '@/shared/components/DiaryRowCard';
import { useEffect, useState } from 'react';
import { getUserCommentedDiaries, getUserDiaries, getUserLikedDiaries } from '@/shared/api/diary';
import { useNavigate, useParams } from 'react-router-dom';
import Tabs from './Tab';
import { getUserDataById } from '@/shared/api/user';
import UserDetailInfoSection from './UserDetailInfoSection';

type DiaryRow = Awaited<ReturnType<typeof getUserDiaries>>[0];

const UserDetail = () => {
  const [diaries, setDiaries] = useState<DiaryRow[]>([]);
  const [userInfo, setUserInfo] = useState<Awaited<ReturnType<typeof getUserDataById>> | null>(
    null,
  );
  const { slug } = useParams<{ slug: string }>();
  const [activeTabId, setActiveTabId] = useState('diary');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiaries = async () => {
      if (!slug) return;
      try {
        const user = await getUserDataById(slug);
        if (!user) {
          navigate('/users');
          return;
        }

        let data: DiaryRow[] = [];
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
        setUserInfo(user);
        setDiaries(data);
      } catch (e) {
        console.error('다이어리 가져오기 실패:', e);
      }
    };

    fetchDiaries();
  }, [activeTabId]);

  return (
    <main className={S.container}>
      <DiaryWeather />
      <UserDetailInfoSection userInfo={userInfo} />
      <Tabs onTabChange={setActiveTabId} />
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
        </div>
      </section>
    </main>
  );
};
export default UserDetail;
