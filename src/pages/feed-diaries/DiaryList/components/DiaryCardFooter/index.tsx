import S from './style.module.css';
import { FaRegHeart } from 'react-icons/fa';
import { FaRegCommentDots } from 'react-icons/fa6';

const DiaryCardFooter = () => {
  return (
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
  );
};
export default DiaryCardFooter;
