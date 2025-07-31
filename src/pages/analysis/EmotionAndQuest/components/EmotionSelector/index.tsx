import S from '@/pages/analysis/EmotionAndQuest/style.module.css';
import type { Database } from '@/shared/api/supabase/types';

type EmotionSub = Database['public']['Tables']['emotion_subs']['Row'];

interface Props {
  emotions: EmotionSub[];
  selected: number[];
  onToggle: (id: number) => void;
}

function EmotionSelector({ emotions, selected, onToggle }: Props) {
  return (
    <section className={S.emotionSection}>
      <h3>당시 느꼈던 감정들을 자유롭게 선택해보세요</h3>
      <ul className={S.emotionList}>
        {emotions.map((emotion) => (
          <li key={emotion.id}>
            <button
              type="button"
              className={`${S.subEmotionBtn} ${selected.includes(emotion.id) ? S.selected : ''}`}
              onClick={() => onToggle(emotion.id)}
            >
              {emotion.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default EmotionSelector;