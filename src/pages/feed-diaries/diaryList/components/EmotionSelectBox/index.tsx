import Select, { type StylesConfig } from 'react-select';
import makeAnimated from 'react-select/animated';
import S from './style.module.css';
import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const animatedComponents = makeAnimated();

interface Emotion {
  id: number;
  name: string;
  URL: string;
}

interface Props {
  emotions: Emotion[];
}

const customStyles: StylesConfig<Emotion, true> = {
  control: (provided) => ({
    ...provided,
    width: '100px',
    height: '28px',
    borderRadius: '8px',
    background: '#6B8A47',
    color: 'white',
  }),
  option: (provided) => ({
    ...provided,
    backgroundColor: '#A7C584',
    color: 'white',
    fontSize: '16px',
  }),
  menu: (provided) => ({
    ...provided,
    width: '100px',
    backgroundColor: '#A7C584',
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: 'transparent',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: 'white',
  }),
  input: (provided) => ({
    ...provided,
    color: 'white',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: 'white',
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    color: 'white',
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: 'white',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'white',
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: 'none',
  }),
  valueContainer: (provided) => ({
    ...provided,
    flexWrap: 'nowrap',
    overflowX: 'auto',
    maxWidth: '100%',
  }),
};

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
        placeholder="감정 선택"
        styles={customStyles}
      />

      <div className={S.selectedList}>
        {selectedEmotions.map((emotion) => (
          <div key={emotion.id} className={S.selectedEmotion}>
            <img src={emotion.URL} alt={emotion.name} />
            {emotion.name}
            <AiOutlineClose className={S.deleteIcon} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmotionSelectBox;
