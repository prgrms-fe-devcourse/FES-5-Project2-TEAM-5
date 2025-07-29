import { type OptionProps, type PlaceholderProps, type StylesConfig } from 'react-select';
import { components } from 'react-select';
import S from './style.module.css';
import type { Emotion } from '@/shared/types/emotion';

export const customStyles: StylesConfig<Emotion, true> = {
  control: (provided, state) => ({
    ...provided,
    width: '100px',
    height: '28px',
    borderRadius: '8px',
    background: 'white',
    border: '1px solid #dbdbdb',
    color: '#303030',
    position: 'relative',
    '&:hover': {
      border: '1px solid #dbdbdb',
      boxShadow: 'none',
    },
    ...(state.isFocused && {
      border: '1px solid #dbdbdb',
      boxShadow: 'none',
    }),
  }),
  option: (provided) => ({
    ...provided,
    backgroundColor: 'white',
    color: '#303030',
    fontSize: '16px',
    borderBottom: '1px solid #dbdbdb',
    '&:last-child': {
      borderBottom: 'none',
    },
  }),
  menu: (provided) => ({
    ...provided,
    width: '100px',
    color: '#303030',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: '#303030',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#303030',
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: 'none',
  }),
  noOptionsMessage: () => ({
    display: 'none',
  }),
};

export const CustomOption = (props: OptionProps<Emotion, true>) => {
  const { data } = props;
  return (
    <components.Option {...props}>
      <div className={S.optionContent}>
        <img src={data.icon_url} alt={data.name} className={S.optionIcon} />
        <span>{data.name}</span>
      </div>
    </components.Option>
  );
};

export const CustomPlaceholder = (props: PlaceholderProps<Emotion, true>) => {
  return (
    <components.Placeholder {...props}>
      <div className={S.placeholder}>emotion</div>
    </components.Placeholder>
  );
};
