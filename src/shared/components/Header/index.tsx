import Logo from '@/assets/logo.svg';
import { withConditionalRender, withDynamicHeaderRender } from '@/shared/hoc';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLogOut, FiBell } from 'react-icons/fi';
import { PiUserCircleThin } from 'react-icons/pi';
import { MENU_LIST } from './constants';
import S from './style.module.css';
import { useUserContext } from '@/shared/context/UserContext';
import type { CSSProperties } from 'react';
import { toastUtils } from '../Toast';

const Header = ({ style }: { style: CSSProperties }) => {
  const navigate = useNavigate();
  const { logout, isAuth, userInfo } = useUserContext();

  const { color, border } = style;

  const handleHome = () => {
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    navigate('/about');
    await logout();
  };

  const handleMypage = () => {
    navigate('/mypage');
  };

  const handleLinkClick = (requireAuth: boolean) => (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (requireAuth && !isAuth) {
      e.preventDefault();
      toastUtils.info({ title: '로그인 필요', message: '해당 서비스는 로그인이 필요합니다.' });
    }
  };

  return (
    <header className={S.container} style={{ color }}>
      <div className={S.logo}>
        <button
          type="button"
          onClick={handleHome}
          aria-label="홈으로 이동"
          className={S.logoButton}
          style={{ color }}
        >
          <img src={Logo} alt="Seediary 로고" />
          <span>Seediary</span>
        </button>
      </div>
      <ul className={S.menuList}>
        {MENU_LIST.map((menu) => (
          <li key={menu.name}>
            <Link
              to={menu.path}
              aria-label={menu.label}
              onClick={handleLinkClick(menu.requireAuth)}
              className={menu.requireAuth && !isAuth ? S.disabled : ''}
            >
              {menu.name}
            </Link>
          </li>
        ))}
      </ul>
      <div className={S.authMenu}>
        {isAuth ? (
          <div className={S.buttonGroup}>
            <button
              type="button"
              aria-label="알림 (새 알림있음)"
              className={S.bellButton}
              data-tooltip="알림 (새 알림있음)"
            >
              <div className={S.notificationBadge} aria-hidden="true" />
              <FiBell size={24} aria-hidden="true" style={{ color }} />
            </button>
            <button
              type="button"
              className={S.mypageButton}
              onClick={handleMypage}
              aria-label="마이페이지 가기"
              data-tooltip="마이페이지"
            >
              {userInfo?.profile_image ? (
                <img src={userInfo.profile_image} alt="" className={S.profileImage} />
              ) : (
                <PiUserCircleThin size={30} aria-hidden="true" style={{ color }} />
              )}
            </button>
            <button
              className={S.authButton}
              type="button"
              onClick={handleLogout}
              aria-label="로그아웃"
              style={{ color, border }}
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>
        ) : (
          <button
            className={S.authButton}
            type="button"
            onClick={handleLogin}
            aria-label="로그인"
            style={{ color, border }}
          >
            <FiUser size={16} /> Login
          </button>
        )}
      </div>
    </header>
  );
};
export default withConditionalRender(withDynamicHeaderRender(Header));
