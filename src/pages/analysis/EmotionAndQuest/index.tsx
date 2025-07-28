import { useEffect, useState } from 'react';
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

function EmotionAndQuest() {
  const location = useLocation();
  const { diaryId } = (location.state as { diaryId?: string }) || {};
  const { user } = useUserContext();
  const navigate = useNavigate();

  const { diary, emotionSubs, quests, loading } = useEmotionAndQuest(diaryId);

  const emotionSelection = useToggleList();  // 감정 선택
  const questSelection = useToggleList(); // 퀘스트 선택
  const [questAccepted, setQuestAccepted] = useState<boolean | null>(null);
  const [reason, setReason] = useState('');


  useEffect(() => {
    if (questAccepted  === true) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [questAccepted]);

  const handleSubmit = async () => {
    console.log('선택된 감정:', emotionSelection.selected)
    if (!user || !diaryId) return alert('로그인이 필요합니다.');

    try {
      // 1. diary_analysis 저장
      const { data: analysis, error: analysisError } = await supabase
        .from('diary_analysis')
        .insert({
          diary_id: diaryId,
          user_id: user.id,
          reason_text: reason || null,
          is_quest_accepted: questAccepted ?? false,
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

      alert('분석이 저장되었습니다!');
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
        <section className={S.submitSection}>
          <button type="button" className={S.submit} onClick={handleSubmit}>
            완료
          </button>
        </section>
      )}
    </main>
  );
}

export default EmotionAndQuest;