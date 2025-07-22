import { useId } from 'react';
import S from './style.module.css';
import UserCard from './components/UserCard';
import { IoSearch } from 'react-icons/io5';

const UserList = () => {
  const searchId = useId();

  interface User {
    id: number;
    name: string;
    email: string;
    profile_image: string | null;
  }

  const users: User[] = [
    {
      id: 1,
      name: '콜라인간',
      profile_image: null,
      email: 'cola@example.com',
    },
    {
      id: 2,
      name: 'Sophia Sorensen',
      profile_image: null,
      email: 'sophia@example.com',
    },
    {
      id: 3,
      name: '응구리',
      profile_image: '/avatars/earth.png',
      email: 'earth@example.com',
    },
    {
      id: 4,
      name: 'jillypaws17',
      profile_image: '/avatars/cat.png',
      email: 'jilly@example.com',
    },
    {
      id: 5,
      name: 'Jelly June',
      profile_image: null,
      email: 'jelly@example.com',
    },
    {
      id: 6,
      name: 'washitaime_OS',
      profile_image: '/avatars/wave.png',
      email: 'wash@example.com',
    },
    {
      id: 7,
      name: 'flapd19',
      profile_image: null,
      email: 'flap@example.com',
    },
    {
      id: 8,
      name: '대아이패드',
      profile_image: '/avatars/ipad.png',
      email: 'ipad@example.com',
    },
    {
      id: 9,
      name: '콜라인간',
      profile_image: null,
      email: 'cola@example.com',
    },
    {
      id: 10,
      name: 'Sophia Sorensen',
      profile_image: null,
      email: 'sophia@example.com',
    },
    {
      id: 11,
      name: '응구리',
      profile_image: '/avatars/earth.png',
      email: 'earth@example.com',
    },
    {
      id: 12,
      name: 'jillypaws17',
      profile_image: '/avatars/cat.png',
      email: 'jilly@example.com',
    },
    {
      id: 13,
      name: 'Jelly June',
      profile_image: null,
      email: 'jelly@example.com',
    },
    {
      id: 14,
      name: 'washitaime_OS',
      profile_image: '/avatars/wave.png',
      email: 'wash@example.com',
    },
    {
      id: 15,
      name: 'flapd19',
      profile_image: null,
      email: 'flap@example.com',
    },
    {
      id: 16,
      name: '대아이패드',
      profile_image: '/avatars/ipad.png',
      email: 'ipad@example.com',
    },
  ];

  return (
    // <Header />
    <main className={S.container}>
      <header className={S.header}>
        <h2 className={S.title}>함께하는 사람들</h2>
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
          />
        </div>
      </header>

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
    </main>
  );
};
export default UserList;
