import { memo, useId } from 'react';
import S from './style.module.css';
import { IoSearch } from 'react-icons/io5';

interface Props {
  onSearch: (searchTerm: string) => void;
}

const SearchBox = ({ onSearch }: Props) => {
  const searchId = useId();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    onSearch(searchTerm);
  };

  return (
    <div className={S.searchBox}>
      <label htmlFor={searchId} className="sr-only">
        사용자 이름 또는 이메일 검색
      </label>
      <IoSearch className={S.searchIcon} />
      <input
        id={searchId}
        type="search"
        className={S.searchInput}
        placeholder="이름이나 이메일을 검색해보세요"
        onChange={handleSearch}
      />
    </div>
  );
};
export default memo(SearchBox);
