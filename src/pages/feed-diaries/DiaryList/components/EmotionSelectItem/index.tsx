import type { Emotion } from '../..';
import { AiOutlineClose } from 'react-icons/ai';
import S from './style.module.css';

interface Props {
  emotion: Emotion;
}

function EmotionSelectItem({ emotion }: Props) {
  return (
    <li key={emotion.id} className={S.selectedEmotion}>
      <img src={emotion.URL} alt={emotion.name} />
      {emotion.name}
      <AiOutlineClose className={S.deleteIcon} />
    </li>
  );
}
export default EmotionSelectItem;
