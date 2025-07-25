import type { User } from '../..';
import UserCard from '../UserCard';
import S from './style.module.css';

interface Props {
  users: User[];
}

const UserList = ({ users }: Props) => {
  return (
    <section aria-label="사용자 목록" className={S.userSection}>
      {users.length <= 0 ? (
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
