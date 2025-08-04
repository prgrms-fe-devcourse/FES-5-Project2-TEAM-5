import S from './style.module.css';
import defaultProfile from '@/assets/defaultProfile.svg';
import type { Tables } from '@/shared/api/supabase/types';
import { formatToReadableDate } from '@/shared/utils/formatDate';

type Props = {
  userInfo: Tables<'users'> | null;
};

const UserInfoSection = ({ userInfo }: Props) => {
  return (
    <section className={S.hero}>
      <h2 className="sr-only">사용자 정보</h2>
      <div className={S.profileSection}>
        <img
          src={userInfo?.profile_image ? userInfo.profile_image : defaultProfile}
          alt={userInfo?.name ? `${userInfo.name}님의 프로필 사진` : '기본 프로필 사진'}
          loading="lazy"
        />
      </div>
      <div className={S.info}>
        <span className={S.username}>{userInfo?.name}</span>
        <span>{userInfo?.email}</span>
        <span>Joined on {formatToReadableDate(userInfo?.created_at || '')}</span>
      </div>
    </section>
  );
};
export default UserInfoSection;
