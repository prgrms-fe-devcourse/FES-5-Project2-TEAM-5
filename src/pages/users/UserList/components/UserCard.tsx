import S from './style.module.css';
import defaultProfile from '../assets/default_profile.svg';
import { FaArrowRightLong } from 'react-icons/fa6';

const default_image = defaultProfile;

interface User {
  id: number;
  name: string;
  email: string;
  profile_image: string | null;
}

interface Props {
  user: User;
}

function UserCard({ user }: Props) {
  const { name, email, profile_image } = user;
  return (
    <article className={S.card}>
      {profile_image ? (
        <img src={profile_image} alt={`${name}의 프로필 이미지`} className={S.profile} />
      ) : (
        <img src={default_image} alt={`${name}의 기본 프로필 이미지`} className={S.profile} />
      )}

      <div className={S.userInfo}>
        <p className={S.userName}>{name}</p>
        <p className={S.userEmail}>{email}</p>
      </div>
      <button type="button" className={S.userButton} aria-label={`${name}의 상세 페이지 보러가기`}>
        보러가기
        <FaArrowRightLong className={S.arrowIcon} />
      </button>
    </article>
  );
}
export default UserCard;
