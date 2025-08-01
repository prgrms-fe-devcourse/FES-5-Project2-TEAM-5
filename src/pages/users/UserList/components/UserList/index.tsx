import type { DbUser } from '@/shared/types/dbUser';
import UserCard from '../UserCard';
import S from './style.module.css';
import Spinner from '@/shared/components/Spinner';

interface Props {
  users: DbUser[];
  isLoading: boolean;
}

const UserList = ({ users, isLoading }: Props) => {
  return (
    <section aria-label="사용자 목록" className={S.userSection}>
      {isLoading ? (
        <Spinner />
      ) : users.length <= 0 ? (
        <p className={S.noResult} role="status">
          검색 결과가 없습니다.
        </p>
      ) : (
        <ul className={S.userList}>
          {users.map((user) => (
            <li key={user.id}>
              <UserCard user={user} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
export default UserList;
