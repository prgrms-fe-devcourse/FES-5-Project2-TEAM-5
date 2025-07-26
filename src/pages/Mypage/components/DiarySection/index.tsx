import S from './style.module.css';
import DiaryRowCard from '@/shared/components/DiaryRowCard';
import { type DiaryRowEntity } from '@/shared/types/diary';
import { useEffect, useState } from 'react';
import supabase from '@/shared/supabase/supabase';
import { toastUtils } from '@/shared/utils/toastUtils';
import { transformDiaryData } from '@/shared/utils/formatter/supabase';

const DiarySection = () => {
  const [diaries, setDiaries] = useState<DiaryRowEntity[]>([]);

  useEffect(() => {
    const fetchDiary = async () => {
      const { data, error } = await supabase
        .from('diaries')
        .select(
          'id, title, created_at, is_public,diary_image,emotion_mains(name, icon_url),diary_hashtags(hashtags(id,name)),likes(count),comments(count) ',
        );

      if (error || !data) {
        toastUtils.error({ title: '실패', message: '다이어리 목록 로드에 실패했습니다.' });
        setDiaries([]);
        return;
      }

      setDiaries(transformDiaryData(data) || []);
    };
    fetchDiary();
  }, []);

  // console.log(diaries.map((d) => d.emotion_mains));

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
