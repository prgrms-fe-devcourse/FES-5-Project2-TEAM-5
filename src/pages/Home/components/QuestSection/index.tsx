import { getTodayAcceptedQuestList } from '@/shared/api/quest';
import { useUserContext } from '@/shared/context/UserContext';
import type { Quest } from '@/shared/types/quest';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { LuChevronDown, LuChevronUp, LuClipboardCheck } from 'react-icons/lu';
import QuestItem from './components/QuestItem';
import style from './style.module.css';

const QuestSection = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [quests, setQuests] = useState<Quest[]>([]);
  const { userInfo } = useUserContext();

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!userInfo?.id) return;
    startTransition(async () => {
      const data = await getTodayAcceptedQuestList(userInfo.id);
      setQuests(data);
    });
  }, [userInfo?.id]);

  // 낙관적 업데이트
  const handleQuestUpdate = useCallback((questId: number) => {
    setQuests((prev) =>
      prev.map((quest) =>
        quest.quest_id === questId ? { ...quest, is_completed: !quest.is_completed } : quest,
      ),
    );
  }, []);

  return (
    <div className={style.questSection}>
      <div
        className={style.questButton}
        role="button"
        aria-label="퀘스트 목록 토글"
        onClick={handleToggle}
      >
        <LuClipboardCheck size={25} />
        <span>Quest</span>
        {isOpen ? <LuChevronUp size={20} /> : <LuChevronDown size={20} />}
      </div>
      {isOpen && (
        <ul className={style.questList}>
          {isPending ? (
            <div className={style.sinnerWrapper}>
              <span>퀘스트 불러오는 중..</span>
            </div>
          ) : (
            <>
              {quests.map((quest) => (
                <QuestItem quest={quest} key={quest.quest_id} onUpdate={handleQuestUpdate} />
              ))}
            </>
          )}
        </ul>
      )}
    </div>
  );
};
export default QuestSection;
