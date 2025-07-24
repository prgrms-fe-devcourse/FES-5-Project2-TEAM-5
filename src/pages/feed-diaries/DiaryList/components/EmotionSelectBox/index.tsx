import Select from 'react-select';
import S from './style.module.css';
import makeAnimated from 'react-select/animated';
import { useState } from 'react';
import type { Emotion } from '../..';
import { AiOutlineClose } from 'react-icons/ai';
import EmotionSelectItem from '../EmotionSelectItem';
import { CustomOption, CustomPlaceholder, customStyles } from './customStyle';

const animatedComponents = makeAnimated();

interface Props {
  emotions: Emotion[];
}

const EmotionSelectBox = ({ emotions }: Props) => {
  const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>([]);

  const handleAllDelete = () => {
    setSelectedEmotions([]);
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
        onChange={(s) => setSelectedEmotions(s as Emotion[])}
        styles={customStyles}
        isClearable={false}
        value={selectedEmotions}
      />

      <ul className={S.selectedList}>
        {selectedEmotions.map((emotion) => (
          <EmotionSelectItem key={emotion.id} emotion={emotion} />
        ))}
      </ul>
      {selectedEmotions.length > 1 && (
        <AiOutlineClose className={S.allSelectedDelete} onClick={handleAllDelete} />
      )}
    </div>
  );
};

export default EmotionSelectBox;
