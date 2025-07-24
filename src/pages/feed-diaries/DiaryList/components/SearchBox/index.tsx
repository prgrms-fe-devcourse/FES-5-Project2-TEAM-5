import { useId } from 'react';
import { IoSearch } from 'react-icons/io5';
import S from './style.module.css';

const SearchBox = () => {
  const searchId = useId();

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
      />
    </div>
  );
};
export default SearchBox;
