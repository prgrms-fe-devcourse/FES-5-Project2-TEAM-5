import { useState, useRef, useEffect } from 'react';
import { IoArrowUpCircleOutline } from 'react-icons/io5';
import { BsChat } from 'react-icons/bs';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { BiEdit, BiTrash, BiCheck, BiX } from 'react-icons/bi';
import { toastUtils } from '@/shared/components/Toast';
import type { DisplayComment } from '@/shared/types/diary';
import S from '../style.module.css';
import type { Tables } from '@/shared/api/supabase/types';
import { formatToSimpleDate } from '@/shared/utils/formatDate';

interface CommentSectionProps {
  comments: DisplayComment[];
  currentUser: Tables<'users'> | null;
  isLiked: boolean;
  likesCount: number;
  onLike: () => Promise<void>;
  onAddComment: (content: string) => Promise<void>;
  onEditComment: (commentId: string, content: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
}

export const CommentSection = ({
  comments,
  currentUser,
  isLiked,
  likesCount,
  onLike,
  onAddComment,
  onEditComment,
  onDeleteComment,
}: CommentSectionProps) => {
  const [newCommentInput, setNewCommentInput] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentInput, setEditCommentInput] = useState('');

  // 댓글 리스트 스크롤을 위한 ref
  const commentsListRef = useRef<HTMLDivElement>(null);

  // 새 댓글이 추가될 때만 스크롤을 맨 아래로 이동 (초기 로드 시에는 맨 위 유지)
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!isInitialLoad && commentsListRef.current) {
      commentsListRef.current.scrollTop = commentsListRef.current.scrollHeight;
    }
    if (isInitialLoad && comments.length > 0) {
      setIsInitialLoad(false);
    }
  }, [comments.length, isInitialLoad]); // comments 배열의 길이가 변경될 때마다 실행

  const handleAddComment = async () => {
    if (newCommentInput.trim()) {
      await onAddComment(newCommentInput);
      setNewCommentInput('');
      // 댓글 추가 후 스크롤을 맨 아래로 이동 (약간의 지연을 두어 DOM 업데이트 후 실행)
      setTimeout(() => {
        if (commentsListRef.current) {
          commentsListRef.current.scrollTop = commentsListRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  const handleEditComment = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditCommentInput(content);
  };

  const handleSaveEditComment = async (commentId: string) => {
    if (!editCommentInput.trim()) {
      toastUtils.error({ title: '오류', message: '댓글 내용을 입력해주세요.' });
      return;
    }

    try {
      await onEditComment(commentId, editCommentInput);
      setEditingCommentId(null);
      setEditCommentInput('');
      toastUtils.success({ title: '성공', message: '댓글이 수정되었습니다.' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '댓글 수정에 실패했습니다.';
      console.error('댓글 수정 실패:', errorMessage);
      toastUtils.error({ title: '실패', message: errorMessage });
    }
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentInput('');
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('정말로 댓글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await onDeleteComment(commentId);
      toastUtils.success({ title: '성공', message: '댓글이 삭제되었습니다.' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '댓글 삭제에 실패했습니다.';
      console.error('댓글 삭제 실패:', errorMessage);
      toastUtils.error({ title: '실패', message: errorMessage });
    }
  };

  // 현재 사용자가 댓글 작성자인지 확인
  const isCommentOwner = (commentUserId: string) => {
    return currentUser && currentUser.id === commentUserId;
  };

  return (
    <section className={S.commnetArea}>
      <h4 className="sr-only">댓글 영역</h4>

      <div className={S.commentHead}>
        <span>
          <BsChat size={20} />
          댓글 {comments.length}
        </span>
        <button onClick={onLike} className={S.likeButton}>
          {isLiked ? <IoMdHeart color="red" size={24} /> : <IoMdHeartEmpty size={24} />}
          {likesCount}
        </button>
      </div>

      <div className={S.commentBox}>
        {comments.length > 0 ? (
          <div ref={commentsListRef} className={S.commentItem}>
            {comments.map((comment) => (
              <div key={comment.id} className={S.commentWrapper}>
                <div className={S.profileImage}>
                  {comment.profile_image_url ? (
                    <img src={comment.profile_image_url} alt={`${comment.author}의 프로필`} />
                  ) : (
                    <span>{comment.author.charAt(0)}</span>
                  )}
                </div>

                <div className={S.commentInfo}>
                  <div className={S.userInfo}>
                    <span>{comment.author}</span>
                    <span className={S.createDate}>{formatToSimpleDate(comment.timestamp)}</span>
                  </div>

                  {editingCommentId === comment.id ? (
                    // 수정 모드
                    <div className={S.editCommentArea}>
                      <input
                        type="text"
                        className={S.customInput}
                        value={editCommentInput}
                        onChange={(e) => setEditCommentInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleSaveEditComment(comment.id);
                          if (e.key === 'Escape') handleCancelEditComment();
                        }}
                        autoFocus
                      />
                      <div className={S.editButtonGroup}>
                        <button
                          onClick={() => handleSaveEditComment(comment.id)}
                          className={S.saveBtn}
                          disabled={!editCommentInput.trim()}
                        >
                          <BiCheck size={18} />
                        </button>
                        <button onClick={handleCancelEditComment} className={S.cancelBtn}>
                          <BiX size={18} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    // 일반 모드
                    <div className={S.commentContentArea}>
                      <p className={S.commentContent}>{comment.content}</p>
                      {isCommentOwner(comment.user_id) && (
                        <div className={S.commentActions}>
                          <button
                            onClick={() => handleEditComment(comment.id, comment.content)}
                            className={S.editCommentBtn}
                            title="댓글 수정"
                          >
                            <BiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className={S.deleteCommentBtn}
                            title="댓글 삭제"
                          >
                            <BiTrash size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={S.noComments}>아직 댓글이 없어요. 첫 댓글을 남겨주세요! 😊</p>
        )}

        <div className={S.commentPrompt}>
          <input
            type="text"
            className={S.customInput}
            value={newCommentInput}
            onChange={(e) => setNewCommentInput(e.target.value)}
            placeholder="응원과 공감의 글을 보내 주세요"
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleAddComment();
            }}
          />
          <button
            onClick={handleAddComment}
            className={S.commentBtn}
            disabled={!newCommentInput.trim()}
          >
            <IoArrowUpCircleOutline size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CommentSection;
