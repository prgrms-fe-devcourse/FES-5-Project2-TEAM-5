import Select from 'react-select';
import S from './style.module.css';
import makeAnimated from 'react-select/animated';
import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import EmotionSelectItem from '../EmotionSelectItem';
import { CustomOption, CustomPlaceholder, customStyles } from './customStyle';
import type { Emotion } from '@/shared/types/emotion';

const animatedComponents = makeAnimated();

interface Props {
  emotions: Emotion[];
  onFilter: (selectedEmotions: Emotion[]) => void;
}

const EmotionSelectBox = ({ emotions, onFilter }: Props) => {
  const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>([]);

  const handleEmotionChange = (addSelectedEmotions: Emotion[]) => {
    setSelectedEmotions(addSelectedEmotions);
    onFilter(addSelectedEmotions);
  };

  const handleAllDelete = () => {
    setSelectedEmotions([]);
    onFilter([]);
  };

  const handleItemDelete = (deleteEmotion: Emotion) => {
    const deleteSelectedEmotion = selectedEmotions.filter(
      (emotion) => emotion.id !== deleteEmotion.id,
    );
    setSelectedEmotions(deleteSelectedEmotion);
    onFilter(deleteSelectedEmotion);
  };

  return (
    <div className={S.container}>
      <Select<Emotion, true>
        isSearchable={false}
        components={{
          ...animatedComponents,
          Option: CustomOption,
          Placeholder: CustomPlaceholder,
        }}
        options={emotions}
        getOptionLabel={(e) => e.name}
        getOptionValue={(e) => String(e.id)}
        isMulti
        closeMenuOnSelect={false}
        controlShouldRenderValue={false}
        onChange={(s) => handleEmotionChange(s as Emotion[])}
        styles={customStyles}
        isClearable={false}
        value={selectedEmotions}
      />

      <ul className={S.selectedList}>
        {selectedEmotions.map((emotion) => (
          <EmotionSelectItem key={emotion.id} emotion={emotion} onDelete={handleItemDelete} />
        ))}
      </ul>
      {selectedEmotions.length > 1 && (
        <AiOutlineClose className={S.allSelectedDelete} onClick={handleAllDelete} />
      )}
    </div>
  );
};

export default EmotionSelectBox;
