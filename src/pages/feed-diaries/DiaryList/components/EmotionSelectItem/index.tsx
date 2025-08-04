import { AiOutlineClose } from 'react-icons/ai';
import S from './style.module.css';
import type { Emotion } from '@/shared/types/emotion';

interface Props {
  emotion: Emotion;
  onDelete: (emotion: Emotion) => void;
}

function EmotionSelectItem({ emotion, onDelete }: Props) {
  const handleDelete = () => {
    onDelete(emotion);
  };
  return (
    <li key={emotion.id} className={S.selectedEmotion}>
      <img src={emotion.icon_url} alt={emotion.name} className={S.selectedEmotionIcon} />
      {emotion.name}
      <AiOutlineClose className={S.deleteIcon} onClick={handleDelete} />
    </li>
  );
}
export default EmotionSelectItem;
