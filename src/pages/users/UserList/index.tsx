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
    }),
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
      {hasMore && <div ref={targetRef}>{isLoading && <Spinner />}</div>}
    </main>
  );
};

export default UserPage;
