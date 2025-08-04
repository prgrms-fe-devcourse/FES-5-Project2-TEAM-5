import style from './style.module.css';
import ChangeProfile from '../ChangeProfile';
import ChangeNickname from '../ChangeNickname';
import ChangePassword from '../ChangePassword';

const ChangeUserInfo = () => {
  return (
    <section className={style.contents}>
      <h2 className="sr-only">정보 변경</h2>
      <ChangeProfile />
      <div className={style.infoSection}>
        <ChangeNickname />
        <hr />
        <ChangePassword />
      </div>
    </section>
  );
};
export default ChangeUserInfo;
