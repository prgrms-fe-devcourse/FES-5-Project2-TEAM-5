import S from './style.module.css';
import { FaRegHeart } from 'react-icons/fa';
import { FaRegCommentDots } from 'react-icons/fa6';

interface Props {
  likesCount: number;
  commentsCount: number;
}
const DiaryCardFooter = ({ likesCount, commentsCount }: Props) => {
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <footer className={S.interaction}>
      <div className={S.comment}>
        <FaRegCommentDots className={S.commentIcon} />
        <span className={S.count}>{commentsCount}</span>
      </div>
      <div className={S.like}>
        <button className={S.likeButton} onClick={handleLikeClick}>
          <FaRegHeart className={S.likeIcon} />
        </button>
        <span className={S.count}>{likesCount}</span>
      </div>
    </footer>
  );
};
export default DiaryCardFooter;
