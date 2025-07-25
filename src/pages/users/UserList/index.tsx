import S from './style.module.css';
import UserList from './components/UserList';
import SearchBox from './components/SearchBox';

export interface User {
  id: number;
  name: string;
  profile_image: string | null;
  email: string;
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

const UserPage = () => {
  return (
    // <Header />
    <main className={S.container}>
      <header className={S.header}>
        <h2 className={S.title}>함께하는 사람들</h2>
        <SearchBox />
      </header>
      <UserList users={users} />
    </main>
  );
};
export default UserPage;
