import S from './style.module.css';
import UserList from './components/UserList';
import SearchBox from './components/SearchBox';
import { useUserSearch } from './hooks/useUserSearch';
import { useCallback, useEffect, useState } from 'react';
import type { DbUser } from '@/shared/types/dbUser';
import { debounce } from '@/shared/utils/debounce';
import { getAllUserData } from '@/shared/api/user';
import { toastUtils } from '@/shared/components/Toast';

const UserPage = () => {
  const [users, setUsers] = useState<DbUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { filteredUsers } = useUserSearch(users, searchTerm);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUserData();
        setUsers(data);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        toastUtils.error({ title: '실패', message: '예상하지 못한 에러 발생' });
      }
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
