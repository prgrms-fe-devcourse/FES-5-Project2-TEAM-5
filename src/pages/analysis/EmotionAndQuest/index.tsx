import { useCallback, useEffect, useState } from 'react';
import S from './style.module.css';
import supabase from '@/shared/api/supabase/client';
import { useUserContext } from '@/shared/context/UserContext';
import { useEmotionAndQuest } from './hooks/useEmotionAndQuest';
import DiaryViewer from './components/DiaryViewer';
import EmotionSelector from './components/EmotionSelector';
import ReasonInput from './components/ReasonInput';
import QuestDecision from './components/QuestDecision';
import QuestSelector from './components/QuestSelector';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToggleList } from './hooks/useToggleList';
import { toastUtils } from '@/shared/components/Toast';
import PublicDecision from './components/PublicDecision';
import AnalysisFromAI from './components/AnalysisFromAI';
import type { Analysis } from '@/shared/types/analysis';
import ConfirmModal from '@/shared/components/Modal/ConfirmModal';

function EmotionAndQuest() {
  const location = useLocation();
  const { diaryId } = (location.state as { diaryId?: string }) || {};
  const { user } = useUserContext();
  const navigate = useNavigate();

  const { diary, emotionSubs, quests, loading } = useEmotionAndQuest(diaryId);

  const emotionSelection = useToggleList(); // 감정 선택
  const questSelection = useToggleList(); // 퀘스트 선택
  const [questAccepted, setQuestAccepted] = useState<boolean | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<Analysis>({
    emotionInterpretation: '',
    emotionalTriggers: '',
    empathy: '',
    reminderMessage: '',
    selfReflectionSuggestion: '',
  });

  const [reason, setReason] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (questAccepted === true) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [questAccepted]);

  const handleAiAnalysis = useCallback((analysis: Analysis) => {
    setAiAnalysis(analysis);
  }, []);


  const handleSubmit = async () => {
    console.log('선택된 감정:', emotionSelection.selected);
    if (!user || !diaryId) return alert('로그인이 필요합니다.');

    try {
      // 퀘스트 미선택 시 is_quest_accepted false로 변경
      const accepted = questAccepted && questSelection.selected.length > 0 ? true : false;

      // 1. diary_analysis 저장
      const { data: analysis, error: analysisError } = await supabase
        .from('diary_analysis')
        .insert({
          diary_id: diaryId,
          user_id: user.id,
          reason_text: reason || null,
          is_quest_accepted: accepted,
          is_public: isPublic, // 토글 상태로 저장
          emotionalTriggers: aiAnalysis.emotionalTriggers || null,
          emotionInterpretation: aiAnalysis.emotionInterpretation || null,
          empathy: aiAnalysis.empathy || null,
          reminderMessage: aiAnalysis.reminderMessage || null,
          selfReflectionSuggestion: aiAnalysis.selfReflectionSuggestion || null,
        })
        .select()
        .single();

      if (analysisError || !analysis) {
        console.error('분석 저장 실패:', analysisError);
        return;
      }

      const analysisId = analysis.id;

      // 2. 선택된 감정들 저장
      if (emotionSelection.selected.length > 0) {
        const emotionRows = emotionSelection.selected.map((emotionId) => ({
          diary_analysis_id: analysisId,
          emotion_id: emotionId,
        }));
        await supabase.from('user_selected_emotions').insert(emotionRows);
      }

      // 3. 퀘스트 저장 (퀘스트를 수락하고 선택했을 때만)
      if (questAccepted && questSelection.selected.length > 0) {
        const questRows = questSelection.selected.map((questId) => ({
          diary_analysis_id: analysisId,
          quest_id: questId,
          user_id: user.id,
        }));
        await supabase.from('user_accepted_quests').insert(questRows);
      }

      // 4. diaries 테이블 is_analyzed 컬럼 true로 저장
      const { error: updateError } = await supabase
        .from('diaries')
        .update({ is_analyzed: true })
        .eq('id', diaryId)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('is_analyzed 업데이트 실패:', updateError);
        return;
      }

      toastUtils.success({ title: '성공', message: '분석이 저장되었습니다.' });

      navigate('/', { replace: true });
    } catch (err) {
      console.error('저장 중 오류 발생:', err);
    }
  };

  if (loading) {
    return (
      <main className={S.container}>
        <div className={S.spinner}></div>
      </main>
    );
  }

  if (!diary) {
    return <main className={S.container}>선택한 일기를 불러올 수 없습니다.</main>;
  }

  return (
    <main className={S.container}>
      <DiaryViewer content={diary.content} />
      <EmotionSelector
        emotions={emotionSubs}
        selected={emotionSelection.selected}
        onToggle={emotionSelection.toggle}
      />
      <ReasonInput value={reason} onChange={setReason} />

      <AnalysisFromAI
        content={diary.content}
        emotions={emotionSubs}
        reason={reason}
        mainEmotionId={diary.emotion_main_id}
        setAnalysis={handleAiAnalysis}
        analysis={aiAnalysis}
      />

      <QuestDecision
        accepted={questAccepted}
        onAccept={() => setQuestAccepted(true)}
        onReject={() => setQuestAccepted(false)}
      />
      {questAccepted === true && (
        <QuestSelector
          quests={quests}
          selected={questSelection.selected}
          onToggle={questSelection.toggle}
        />
      )}

      {questAccepted !== null && (
        <>
          <PublicDecision isPublic={isPublic} onChange={setIsPublic} />
          <section className={S.submitSection}>
            <button
              type="button"
              className={S.submit}
              onClick={() => setShowModal(true)}
              disabled={emotionSelection.selected.length === 0}
            >
              완료
            </button>
          </section>
        </>
      )}
      {showModal && (
        <ConfirmModal
          title="감정 분석 결과 저장"
          message="작성한 감정 분석 결과를 저장합니다.
          계속 진행하려면 확인을 눌러주세요."
          onConfirm={() => {
            setShowModal(false);
            handleSubmit();
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </main>
  );
}

export default EmotionAndQuest;
