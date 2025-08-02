import Logo from '@/assets/logo.svg';
import { withConditionalRender, withDynamicHeaderRender } from '@/shared/hoc';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { PiUserCircleThin } from 'react-icons/pi';
import { MENU_LIST } from './constants';
import style from './style.module.css';
import { useUserContext } from '@/shared/context/UserContext';
import { useState, type CSSProperties } from 'react';
import { toastUtils } from '../Toast';
import Notification from '../Notification';
import ConfirmModal from '../Modal/ConfirmModal';

const Header = ({ cssOption }: { cssOption: CSSProperties }) => {
  const [showModal, setShowModal] = useState(false); // 모달 컨트롤
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout, isAuth, userInfo } = useUserContext();

  const { color, border } = cssOption;

  const handleHome = () => {
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    setShowModal(true);
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
    <header className={style.container} style={{ color }}>
      {/* 로고 */}
      <div className={style.logo}>
        <button
          type="button"
          onClick={handleHome}
          aria-label="홈으로 이동"
          className={style.logoButton}
          style={{ color }}
        >
          <img src={Logo} alt="Seediary 로고" />
          <span>Seediary</span>
        </button>
      </div>
      {/* 메인 메뉴 */}
      <ul className={style.menuList}>
        {MENU_LIST.map((menu) => (
          <li key={menu.name}>
            <Link
              to={menu.path}
              aria-label={menu.label}
              style={{
                color: menu.path === pathname ? '#f6c915' : '',
                fontWeight: menu.path === pathname ? '700' : '400',
              }}
              onClick={handleLinkClick(menu.requireAuth)}
              className={menu.requireAuth && !isAuth ? style.disabled : ''}
            >
              {menu.name}
            </Link>
          </li>
        ))}
      </ul>
      {/* auth 메뉴 */}
      <div className={style.authMenu}>
        {isAuth ? (
          <div className={style.buttonGroup}>
            <Notification color={color} />
            {/* 마이페이지 */}
            <button
              type="button"
              className={style.mypageButton}
              onClick={handleMypage}
              aria-label="마이페이지 가기"
              data-tooltip="마이페이지"
            >
              {userInfo?.profile_image ? (
                <img src={userInfo.profile_image} alt="" className={style.profileImage} />
              ) : (
                <PiUserCircleThin size={30} aria-hidden="true" style={{ color }} />
              )}
            </button>
            {/* 로그아웃 */}
            <button
              className={style.authButton}
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
          //  로그인
          <button
            className={style.authButton}
            type="button"
            onClick={handleLogin}
            aria-label="로그인"
            style={{ color, border }}
          >
            <FiUser size={16} /> Login
          </button>
        )}
      </div>
      {showModal && (
        <ConfirmModal
          title="로그아웃"
          message="정말 로그아웃 하시겠습니까?"
          onConfirm={async () => {
            navigate('/about');
            await logout();
            setShowModal(false);
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </header>
  );
};
export default withConditionalRender(withDynamicHeaderRender(Header));
