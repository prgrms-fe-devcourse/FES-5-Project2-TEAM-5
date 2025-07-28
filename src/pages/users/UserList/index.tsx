import S from './style.module.css';
import UserList from './components/UserList';
import SearchBox from './components/SearchBox';
import { useUserSearch } from './hooks/useUserSearch';
import { useCallback, useEffect, useState } from 'react';
import { getAllUserData } from './utils/getAllUserData';
import type { DbUser } from '@/pages/users/UserList/types/dbUser';
import { debounce } from '@/shared/utils/debounce';

const UserPage = () => {
  const [users, setUsers] = useState<DbUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { filteredUsers } = useUserSearch(users, searchTerm);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUserData();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleSearch = useCallback(
    debounce((value: string) => {
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
