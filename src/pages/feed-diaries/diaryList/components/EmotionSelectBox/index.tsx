import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import S from './style.module.css';
import { useState } from 'react';

import { customStyles } from './customStyle';
import type { Emotion } from '../..';
import EmotionSelectItem from '../EmotionSelectItem';

import { AiOutlineClose } from 'react-icons/ai';

const animatedComponents = makeAnimated();

interface Props {
  emotions: Emotion[];
}

const EmotionSelectBox = ({ emotions }: Props) => {
  const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>([]);

  return (
    <div className={S.container}>
      <Select<Emotion, true>
        isSearchable={false}
        components={animatedComponents}
        options={emotions}
        getOptionLabel={(e) => e.name}
        getOptionValue={(e) => String(e.id)}
        isMulti
        closeMenuOnSelect={false}
        controlShouldRenderValue={false}
        onChange={(s) => setSelectedEmotions(s as Emotion[])}
        placeholder="감정"
        styles={customStyles}
        isClearable={false}
      />

      <ul className={S.selectedList}>
        {selectedEmotions.map((emotion) => (
          <EmotionSelectItem key={emotion.id} emotion={emotion} />
        ))}
      </ul>
      {selectedEmotions.length > 1 && <AiOutlineClose />}
    </div>
  );
};

export default EmotionSelectBox;
