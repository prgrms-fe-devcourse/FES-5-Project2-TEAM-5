import S from './style.module.css';
import default_image from '@/assets/defaultProfile.svg';
import { formatToReadableDate } from '@/shared/utils/formatDate';
import type { DbUser } from '@/shared/types/dbUser';
import type { Emotion } from '@/shared/types/emotion';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '@/shared/context/UserContext';

const DEFAULT_IMAGE = default_image;

interface Props {
  emotion: Emotion;
  created_at: string;
  user: DbUser;
}

const DiaryCardHeader = ({ emotion, created_at, user }: Props) => {
  const { userInfo } = useUserContext();
  const navigate = useNavigate();
  const handleUserDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (userInfo?.id === user.id) navigate(`/mypage`);
    else navigate(`/users/${user.id}`);
  };

  return (
    <header className={S.header}>
      <div className={S.userInfo} onClick={handleUserDetail}>
        <img
          className={S.userProfile}
          src={user.profile_image || DEFAULT_IMAGE}
          alt={`${user.name}의 프로필 이미지`}
        />
        <strong className={S.userName}>{user.name}</strong>
      </div>
      <div className={S.diaryInfoSub}>
        <time className={S.date} dateTime={created_at}>
          {formatToReadableDate(created_at)}
        </time>
        <div className={S.emotion} aria-label="일기 기분 표시">
          <img className={S.emotionImg} src={emotion?.icon_url} alt={emotion?.name} />
          <span className={S.emotionLabel}>{emotion?.name}</span>
        </div>
      </div>
    </header>
  );
};
export default DiaryCardHeader;
