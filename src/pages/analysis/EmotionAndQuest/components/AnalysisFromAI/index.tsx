import type { Database } from '@/shared/api/supabase/types';
import style from './style.module.css';
import supabase from '@/shared/api/supabase/client';
import { memo, useCallback, useState, useTransition } from 'react';
import { toastUtils } from '@/shared/components/Toast';
import type { Analysis } from '@/shared/types/analysis';

type EmotionSub = Database['public']['Tables']['emotion_subs']['Row'];

interface Props {
  emotions: EmotionSub[];
  reason: string;
  content: string;
  mainEmotionId: number;
  setAnalysis: (analysis: Analysis) => void;
  analysis: Analysis;
}

const AnalysisFromAI = ({
  emotions,
  reason,
  content,
  mainEmotionId,
  setAnalysis,
  analysis,
}: Props) => {
  const [isPending, startTransition] = useTransition();
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleAnalysis = useCallback(() => {
    startTransition(async () => {
      const { data, error } = await supabase.functions.invoke('analysis_emotion', {
        body: {
          diaryContent: content,
          reason: reason,
          emotions: emotions.map((emotion) => emotion.name),
          mainEmotion: mainEmotionId,
        },
      });
      if (error) {
        if (error instanceof Error) {
          toastUtils.error({ title: '실패', message: '감정 분석 요청을 실패했습니다.' });
        }
      }
      setAnalysis(data.data);
      setHasAnalyzed(true);
    });
  }, [content, reason, emotions, mainEmotionId, setAnalysis]);

  return (
    <section className={style.analysisSection}>
      <header className={style.header}>
        <h3>감정 분석하기 🌼</h3>
        <button
          type="button"
          aria-label="감정 감정"
          className={style.analysisButton}
          disabled={isPending || hasAnalyzed}
          onClick={handleAnalysis}
        >
          {isPending ? '분석 중...' : '분석'}
        </button>
      </header>
      {isPending ? (
        <div className={style.analysisBox}>
          <p className={style.pending}>몰리가 당신의 감정을 분석하고 있어요...</p>
        </div>
      ) : !hasAnalyzed ? (
        // 분석 전 상태 UI
        <div className={style.beforeAnalysis}>
          <div className={style.placeholder}>
            <p className={style.placeholderText}>🌼 몰리가 당신의 감정을 깊이 있게 분석해드려요</p>
            <p className={style.placeholderSubText}>
              분석 버튼을 눌러 감정 상태에 대한 인사이트를 받아보세요
            </p>
          </div>
        </div>
      ) : (
        // 분석 완료 후 UI
        <div className={style.analysisWrapper}>
          <p className={style.empathy}>{analysis.empathy}</p>
          <div className={style.analysisResult}>
            <p>[감정 유발 요인]</p>
            <span>{analysis.emotionalTriggers}</span>
          </div>
          <div className={style.analysisResult}>
            <p>[감정 해석]</p>
            <span>{analysis.emotionInterpretation}</span>
          </div>
          <div className={style.analysisResult}>
            <p>[리마인드]</p>
            <span>{analysis.reminderMessage}</span>
          </div>
          <div className={style.analysisResult}>
            <p>[자기성찰]</p>
            <span>{analysis.selfReflectionSuggestion}</span>
          </div>
        </div>
      )}
    </section>
  );
};
export default memo(AnalysisFromAI);
