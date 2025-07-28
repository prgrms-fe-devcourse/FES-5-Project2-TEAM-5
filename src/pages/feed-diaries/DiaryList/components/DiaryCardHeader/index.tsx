import S from './style.module.css';
import default_image from '../../assets/default_image.svg';
import type { Emotion } from '../../type/emotion';
const user = {
  name: '홍길동',
  image: default_image,
};

interface Props {
  emotion: Emotion;
  created_at: string;
}

const DiaryCardHeader = ({ emotion, created_at }: Props) => {
  return (
    <header className={S.header}>
      <div className={S.userInfo}>
        <img className={S.userProfile} src={user.image} alt={`${user.name}의 프로필 이미지`} />
        <strong className={S.userName}>{user.name}</strong>
      </div>
      <div className={S.diaryInfoSub}>
        <time className={S.date} dateTime={created_at}>
          {new Date(created_at).toLocaleDateString('ko-KR')}
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
