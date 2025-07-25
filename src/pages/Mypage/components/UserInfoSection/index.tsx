import S from './style.module.css';
import defaultProfile from '../../assets/defaultProfile.svg';
import { useUser } from '@/shared/hooks/useUser';
import { formatToReadableDate } from '../../utils/helper';

const UserInfoSection = () => {
  const { userInfo } = useUser();

  return (
    <section className={S.hero}>
      <h2 className="sr-only">사용자 정보</h2>
      <div className={S.profileSection}>
        <img
          src={userInfo?.profile_image ? userInfo.profile_image : defaultProfile}
          alt="사용자 프로필"
        />
      </div>
      <div className={S.info}>
        <span className={S.username}>{userInfo?.name}</span>
        <span>Sophia.miller@email.com</span>
        <span>
          Joined on {formatToReadableDate(userInfo?.created_at || '')} | Today's mood:{' '}
          <strong className={S.userMood}>Happy</strong>
        </span>
      </div>
    </section>
  );
};
export default UserInfoSection;
