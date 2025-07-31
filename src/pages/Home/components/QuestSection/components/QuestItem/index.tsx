import { updateQuestState } from '@/shared/api/quest';
import { useUserContext } from '@/shared/context/UserContext';
import type { Quest } from '@/shared/types/quest';
import { memo } from 'react';
import { LuSquare, LuSquareCheck } from 'react-icons/lu';
import style from './style.module.css';

interface Props {
  quest: Quest;
  onUpdate: (questId: number) => void;
}

const QuestItem = ({ quest, onUpdate }: Props) => {
  const { userInfo } = useUserContext();
  const handleQuestComplete = async () => {
    if (!userInfo?.id) return;

    onUpdate(quest.quest_id);

    try {
      void updateQuestState(quest.quest_id, userInfo.id, quest.is_completed);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  return (
    <li className={style.questItem} onClick={handleQuestComplete}>
      {quest.is_completed ? <LuSquareCheck size={24} /> : <LuSquare size={24} />}
      <p
        className={style.questContent}
        style={{ textDecoration: quest.is_completed ? 'line-through' : '' }}
      >
        {quest.quests.content}
      </p>
    </li>
  );
};
export default memo(QuestItem);
