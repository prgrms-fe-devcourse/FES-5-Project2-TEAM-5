import S from './style.module.css';
import UserList from './components/UserList';
import SearchBox from './components/SearchBox';
import { useUserSearch } from './hooks/useUserSearch';
import { useEffect, useMemo, useState } from 'react';
import { debounce } from './utils/debounce';
import { getAllUserData } from './utils/getAllUserData';
import type { DbUser } from '@/shared/supabase/dbUser';

const UserPage = () => {
  const [users, setUsers] = useState<DbUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { filteredUsers } = useUserSearch(users, searchTerm);

  useEffect(() => {
    (async () => {
      const data = await getAllUserData();
      setUsers(data);
    })();
  }, []);

  const handleSearch = useMemo(
    () =>
      debounce((value: string) => {
        // console.log('확인:', value);
        setSearchTerm(value);
      }),
    [],
  );

  return (
    <main className={S.container}>
      <header className={S.header}>
        <h2 className={S.title}>함께하는 사람들</h2>
        <SearchBox onSearch={handleSearch} />
      </header>
      <UserList users={filteredUsers} />
    </main>
  );
};
export default UserPage;
