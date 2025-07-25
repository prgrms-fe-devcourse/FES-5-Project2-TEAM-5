import S from './style.module.css';
import defaultProfile from '../../assets/defaultProfile.svg';

const UserInfoSection = () => {
  return (
    <section className={S.hero}>
      <h2 className="sr-only">사용자 정보</h2>
      <div className={S.profileSection}>
        <img src={`${defaultProfile}`} alt="기본 프로필" />
      </div>
      <div className={S.info}>
        <span className={S.username}>Sophia</span>
        <span>Sophia.miller@email.com</span>
        <span>
          Joined on Jan 15, 2023 | Today's mood: <strong className={S.userMood}>Happy</strong>
        </span>
      </div>
    </section>
  );
};
export default UserInfoSection;
