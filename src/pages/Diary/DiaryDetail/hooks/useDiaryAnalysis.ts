import { useEffect, useState } from 'react';
import supabase from '@/shared/api/supabase/client';
import type { Database } from '@/shared/api/supabase/types';

type EmotionSub = Database['public']['Tables']['emotion_subs']['Row'];

export function useDiaryAnalysis(diaryId: string) {
  const [analysis, setAnalysis] = useState<{
    reason: string | null;
    emotions: EmotionSub[];
    is_public: boolean;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      // 조인으로 감정 분석 이유, 선택한 감정 전부 가져오기
      const { data, error } = await supabase
        .from('diary_analysis')
        .select(`
          reason_text,
          is_public,
          user_selected_emotions (
            emotion_subs (*)
          )
        `)
        .eq('diary_id', diaryId)
        .single();

      if (error || !data) {
        setAnalysis(null);
        setLoading(false);
        return;
      }

      // user_selected_emotions에서 emotion_subs만 추출
      const emotions = data.user_selected_emotions.map((e) => e.emotion_subs);

      setAnalysis({
        reason: data.reason_text, // 분석 이유 저장
        emotions: emotions ?? [], // 감정 저장
        is_public: data.is_public, // 공개 여부 저장
      });

      setLoading(false);
    };

    fetchAnalysis();
  }, [diaryId]); // 일기가 바뀔 때마다 실행

  return { analysis, loading };
}