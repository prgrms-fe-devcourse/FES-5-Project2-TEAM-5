import S from '@/pages/analysis/EmotionAndQuest/style.module.css';

interface Props {
  accepted: boolean | null;
  onAccept: () => void;
  onReject: () => void;
}

function QuestDecision({ accepted, onAccept, onReject }: Props) {
  if (accepted !== null) return null;

  return (
    <section className={S.decisionSection}>
      <h3>추천 퀘스트를 받아보시겠어요?</h3>
      <div className={S.buttons}>
        <button type="button" className={S.reject} onClick={onReject}>
          괜찮아요
        </button>
        <button type="button" className={S.accept} onClick={onAccept}>
          좋아요
        </button>
      </div>
    </section>
  );
}

export default QuestDecision;