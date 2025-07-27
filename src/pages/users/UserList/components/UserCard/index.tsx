import S from './style.module.css';
import default_profile from '../../assets/default_profile.svg';
import { GrFormNextLink } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';
import type { DbUser } from '@/pages/users/UserList/types/dbUser';

const default_image = default_profile;

interface Props {
  user: DbUser;
}

const UserCard = ({ user }: Props) => {
  const { id, name, email, profile_image } = user;
  const navigate = useNavigate();

  const handleUserDetail = () => {
    const slug = id;
    navigate(`/users/${slug}`);
  };

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
      <button
        type="button"
        className={S.userButton}
        aria-label={`${name}의 상세 페이지 보러가기`}
        onClick={handleUserDetail}
      >
        보러가기
        <GrFormNextLink className={S.arrowIcon} />
      </button>
    </article>
  );
};
export default UserCard;
