import S from './style.module.css';
import default_image from '../../assets/default_image.svg';
import { FaRegHeart } from 'react-icons/fa';
import { FaRegCommentDots } from 'react-icons/fa6';

interface Diary {
  id: string;
  user_id: string;
  title: string;
  content: string;
  diary_image: string | null;
  emotion_main_id: number;
  is_public: string;
  create_at: string;
  updated_at: string;
  is_drafted: string;
}

interface Props {
  diary: Diary;
  emotions: Emotion[];
}

interface Emotion {
  id: number;
  name: string;
  URL: string;
}

const user = {
  name: '홍길동',
  image: default_image,
};

const DiaryCard = ({ diary, emotions }: Props) => {
  const { create_at, emotion_main_id, diary_image, title, content } = diary;
  const emotion = emotions.find((e) => e.id === emotion_main_id);
  return (
    <article className={S.card}>
      <header className={S.header}>
        <div className={S.userInfo}>
          <img className={S.userProfile} src={user.image} alt={`${user.name}의 프로필 이미지`} />
          <strong className={S.userName}>{user.name}</strong>
        </div>
        <div className={S.diaryInfoSub}>
          <time className={S.date} dateTime={create_at}>
            {new Date(create_at).toLocaleDateString('ko-KR')}
          </time>
          <div className={S.emotion} aria-label="일기 기분 표시">
            <img className={S.emotionImg} src={emotion?.URL} alt={emotion?.name} />
            <span className={S.emotionLabel}>{emotion?.name}</span>
          </div>
        </div>
      </header>
      {diary_image && (
        <figure>
          <img className={S.diaryImage} src={diary_image} alt="일기 이미지" />
        </figure>
      )}
      <section className={S.diaryInfo}>
        <h3 className={S.title}>{title}</h3>
        <p className={S.content}>{content}</p>
      </section>
      <footer className={S.interaction}>
        <div className={S.comment}>
          <FaRegCommentDots className={S.commentIcon} />
          <span className={S.count}>5</span>
        </div>
        <div className={S.like}>
          <button className={S.likeButton}>
            <FaRegHeart className={S.likeIcon} />
          </button>
          <span className={S.count}>23</span>
        </div>
      </footer>
    </article>
  );
};
export default DiaryCard;
