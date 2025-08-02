import S from './style.module.css';
import UserList from './components/UserList';
import SearchBox from './components/SearchBox';
import { useCallback, useState } from 'react';
import { debounce } from '@/shared/utils/debounce';
import Spinner from '@/shared/components/Spinner';
import { useUserLoader } from './hooks/useUserLoader';

const UserPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { users, targetRef, isLoading, hasMore, initialLoading } = useUserLoader(searchTerm);

  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 500),
    [],
  );

  if (initialLoading) {
    return (
      <main className={S.container}>
        <Spinner />
      </main>
    );
  }

  return (
    <main className={S.container}>
      <header className={S.header}>
        <h2 className={S.title}>함께하는 사람들</h2>
        <SearchBox onSearch={handleSearch} />
      </header>
      <UserList users={users} isLoading={isLoading} />
      {!initialLoading && !isLoading && users.length === 0 && searchTerm !== '' && (
        <p className={S.noResult} role="status">
          검색 결과가 없습니다.
        </p>
      )}
      {isLoading && hasMore && (
        <div className={S.loadingSpinner}>
          <Spinner />
        </div>
      )}
      {hasMore && <div ref={targetRef} className={S.infiniteScrollTrigger} aria-hidden="true" />}
    </main>
  );
};

export default UserPage;
