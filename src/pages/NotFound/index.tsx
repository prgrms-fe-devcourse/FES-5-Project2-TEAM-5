import { useNavigate } from 'react-router-dom';
import style from './style.module.css';
import { PATHS } from '@/shared/constants/path';

const NotFound = () => {
  const navigate = useNavigate();
  const handleHome = () => {
    navigate(PATHS.HOME);
  };

  return (
    <main className={style.container}>
      <h1>
        4
        <img src="https://ttqedeydfvolnyrivpvg.supabase.co/storage/v1/object/public/emotions//icon_anxiety.svg" />
        4 ERROR
      </h1>
      <div className={style.contentWrapper}>
        <p>페이지를 찾을 수 없습니다.</p>
        <p>존재하지 않은 주소를 입력하셨거나,</p>
        <p>요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.</p>
      </div>

      <button className={style.homeButton} onClick={handleHome}>
        홈으로 이동
      </button>
    </main>
  );
};
export default NotFound;
