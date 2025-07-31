import S from '@/pages/analysis/EmotionAndQuest/style.module.css';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

function ReasonInput({ value, onChange }: Props) {
  return (
    <section className={S.reasonSection}>
      <h3>지금 떠오르는 이유를 솔직하게 적어보세요</h3>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={S.emotionReason}
      ></textarea>
    </section>
  );
}

export default ReasonInput;