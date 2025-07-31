import S from '@/pages/analysis/EmotionAndQuest/style.module.css';
import type { Database } from '@/shared/api/supabase/types';

type Quest = Database['public']['Tables']['quests']['Row'];

interface Props {
  quests: Quest[];
  selected: number[];
  onToggle: (id: number) => void;
}

function QuestSelector({ quests, selected, onToggle }: Props) {
  if (!quests.length) return null;

  return (
    <section className={S.questSection}>
      <h3>원하는 퀘스트를 선택해주세요.</h3>
      <ul className={S.questList}>
        {quests.map((q) => (
          <li key={q.id}>
            <article className={S.questCard}>
              <div className={S.cardContent}>
                <h4>{q.title}</h4>
                <p>{q.content}</p>
              </div>
              <button
                type="button"
                className={`${S.cardButton} ${selected.includes(q.id) ? S.selected : ''}`}
                onClick={() => onToggle(q.id)}
              >
                {selected.includes(q.id) ? '해제' : '선택'}
              </button>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default QuestSelector;