import { useEffect, useState } from 'react';
import supabase from '@/shared/api/supabase/client';
import type { Database } from '@/shared/api/supabase/types';

type Diary = Database['public']['Tables']['diaries']['Row'];
type EmotionMain = Database['public']['Tables']['emotion_mains']['Row'];
type EmotionSub = Database['public']['Tables']['emotion_subs']['Row'];
type Quest = Database['public']['Tables']['quests']['Row'];

export function useEmotionAndQuest(diaryId?: string) {
  const [diary, setDiary] = useState<Diary | null>(null);
  const [emotionMain, setEmotionMain] = useState<EmotionMain | null>(null);
  const [emotionSubs, setEmotionSubs] = useState<EmotionSub[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!diaryId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: diaryData, error: diaryError } = await supabase
          .from('diaries')
          .select('*')
          .eq('id', diaryId)
          .single();

        if (diaryError || !diaryData) {
          setError('일기를 불러올 수 없습니다.');
          setDiary(null);
          setLoading(false);
          return;
        }

        setDiary(diaryData);
        const emotionMainId = diaryData.emotion_main_id;

        const [
          { data: mainData, error: mainError },
          { data: subsData, error: subsError },
          { data: questsData, error: questsError },
        ] = await Promise.all([
          supabase.from('emotion_mains').select('*').eq('id', emotionMainId).single(),
          supabase.from('emotion_subs').select('*').eq('emotion_main_id', emotionMainId),
          supabase.from('quests').select('*').eq('emotion_main_id', emotionMainId),
        ]);

        if (mainError || subsError || questsError) {
          setError('관련 데이터를 불러오는 중 오류가 발생했습니다.');
          return;
        }

        if (mainData) setEmotionMain(mainData);
        if (subsData) setEmotionSubs(subsData);
        if (questsData) setQuests(questsData);
      } catch (e) {
        setError('데이터를 불러오는 중 알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [diaryId]);

  return { diary, emotionMain, emotionSubs, quests, loading, error };
}