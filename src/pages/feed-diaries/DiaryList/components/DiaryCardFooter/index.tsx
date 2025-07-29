import { useState } from 'react';
import S from './style.module.css';
import { FaHeart } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa';
import { FaRegCommentDots } from 'react-icons/fa6';
import { deleteLikeToDiary, postLikeToDiary } from '@/shared/api/like';
import { toastUtils } from '@/shared/components/Toast';
import { postLikeNotification } from '@/shared/api/notification';
import type { DbUser } from '@/shared/types/dbUser';
import { useUserContext } from '@/shared/context/UserContext';

interface Props {
  diaryAuthor: DbUser;
  currentUser: string;
  diaryId: string;
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
  onLikeUpdate: (diaryId: string, isLiked: boolean, newCount: number) => void;
}
const DiaryCardFooter = ({
  diaryAuthor,
  currentUser,
  diaryId,
  likesCount,
  isLiked,
  commentsCount,
  onLikeUpdate,
}: Props) => {
  const [currentLikesCount, setCurrentLikesCount] = useState(likesCount);
  const [currentIsLiked, setCurrentIsLiked] = useState(isLiked);
  const { userInfo } = useUserContext();

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (!currentIsLiked) {
        await postLikeToDiary(currentUser, diaryId);
        // 자신의 일기가 아닌 경우에만 알림 생성
        if (currentUser !== diaryAuthor.id && userInfo) {
          await postLikeNotification(diaryAuthor.id, currentUser, diaryId, userInfo.name);
        }
        const count = currentLikesCount + 1;
        setCurrentIsLiked(true);
        setCurrentLikesCount(count);
        onLikeUpdate(diaryId, true, count);
      } else {
        await deleteLikeToDiary(currentUser, diaryId);
        const count = currentLikesCount - 1;
        setCurrentIsLiked(false);
        setCurrentLikesCount(count);
        onLikeUpdate(diaryId, false, count);
      }
    } catch (error) {
      if (error instanceof Error) {
        toastUtils.error({ title: '좋아요 실패', message: error.message });
      }
    }
  };

  return (
    <footer className={S.interaction}>
      <div className={S.comment}>
        <FaRegCommentDots className={S.commentIcon} />
        <span className={S.count}>{commentsCount}</span>
      </div>
      <div className={S.like}>
        <button className={S.likeButton} onClick={handleLikeClick}>
          {isLiked ? <FaHeart className={S.likeIconFill} /> : <FaRegHeart className={S.likeIcon} />}
        </button>
        <span className={S.count}>{likesCount}</span>
      </div>
    </footer>
  );
};
export default DiaryCardFooter;
