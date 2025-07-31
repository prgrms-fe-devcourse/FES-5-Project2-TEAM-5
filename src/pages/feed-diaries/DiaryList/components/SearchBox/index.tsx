import { memo, useId } from 'react';
import { IoSearch } from 'react-icons/io5';
import S from './style.module.css';

interface Props {
  onSearch: (searchTerm: string) => void;
}

const SearchBox = ({ onSearch }: Props) => {
  const searchId = useId();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
      const searchTerm = e.currentTarget.value.trim();
      onSearch(searchTerm);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const searchTerm = e.currentTarget.value.trim();
    if (!searchTerm) {
      onSearch('');
    }
  };

  return (
    <div className={S.searchBox}>
      <label htmlFor={searchId} className="sr-only">
        일기 제목 또는 태그 검색
      </label>
      <IoSearch className={S.searchIcon} />
      <input
        id={searchId}
        type="search"
        className={S.searchInput}
        placeholder="일기 제목이나 태그를 검색해보세요"
        onKeyDown={handleKeyDown}
        onInput={handleInput}
      />
    </div>
  );
};
export default memo(SearchBox);
