import Logo from '@/assets/logo.svg';
import { withConditionalRender } from '@/shared/hoc';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import { MENU_LIST } from './constants';
import S from './style.module.css';
import { useUser } from '@/shared/hooks/useUser';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleHome = () => {
    navigate('/home');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    navigate('/home');
    logout();
  };

  return (
    <header className={S.container}>
      <div className={S.logo} onClick={handleHome}>
        <div tabIndex={0}>
          <img src={Logo} alt="logo" />
          <span>Seediary</span>
        </div>
      </div>
      <ul className={S.menuList}>
        {MENU_LIST.map((menu) => (
          <li key={menu.name} aria-label={menu.label}>
            <Link to={menu.path}>{menu.name}</Link>
          </li>
        ))}
      </ul>
      <div className={S.authMenu}>
        {!user ? (
          <button className={S.authButton} type="button" onClick={handleLogin} aria-label="로그인">
            <FiUser size={16} /> Login
          </button>
        ) : (
          <button
            className={S.authButton}
            type="button"
            onClick={handleLogout}
            aria-label="로그아웃"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};
export default withConditionalRender(Header, ['/login', '/register']);
