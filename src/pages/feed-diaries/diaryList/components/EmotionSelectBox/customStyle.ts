import type { Emotion } from '../..';
import { type StylesConfig } from 'react-select';

export const customStyles: StylesConfig<Emotion, true> = {
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
};
