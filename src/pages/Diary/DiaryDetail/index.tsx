import { useState } from 'react';
import S from './style.module.css';
import DiaryWeather from '@/shared/components/DiaryWeather';
import { useNavigate, useParams } from 'react-router-dom';
import { formatToSimpleDate } from '@/shared/utils/formatDate';
import Spinner from '@/shared/components/Spinner';
import { useDiaryDetail } from '../DiaryMain/hooks/useDiaryDetail';
import CommentSection from './components/CommentSection';
import { IoLockClosedOutline, IoLockOpenOutline } from 'react-icons/io5';
import AnalysisResult from './components/AnalysisResult';
import { useUserContext } from '@/shared/context/UserContext';
import ConfirmModal from '@/shared/components/Modal/ConfirmModal';

const DiaryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUserContext();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    diary,
    author,
    loading,
    error,
    isLiked,
    likesCount,
    comments,
    currentUser,
    handleLike,
    handleAddComment,
    handleEditComment,
    handleDeleteComment,
    handleDelete,
  } = useDiaryDetail(id);

  const handleDeleteClick = () => {
    if (!id) return;
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteModal(false);
    try {
      await handleDelete();
      navigate('/diary');
    } catch (error) {
      console.error('일기 삭제 실패:', error);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <main className={S.container}>
        <Spinner />
      </main>
    );
  }

  if (error) {
    return (
      <main className={S.container}>
        <div className={S.errorWrap}>
          <p>에러가 발생했습니다: {error}</p>
          <button type="button" className={S.bgGrayBtn} onClick={() => navigate('/diary')}>
            목록으로
          </button>
        </div>
      </main>
    );
  }

  if (!diary) {
    return (
      <main className={S.container}>
        <div className={S.errorWrap}>
          <p>일기 데이터가 없습니다.</p>
          <button type="button" className={S.bgGrayBtn} onClick={() => navigate('/diary')}>
            목록으로
          </button>
        </div>
      </main>
    );
  }

  const isAuthor = user?.id === diary.user_id;

  return (
    <main className={S.container}>
      <DiaryWeather />
      <div className={S.inner}>
        <div>
          <div className={S.titleArea}>
            <div>
              <span className={S.date}>{formatToSimpleDate(diary.created_at)}</span>
              <span className={S.userNickname}>{author?.name || '알 수 없는 사용자'}</span>
            </div>
            <h3>
              {diary.title}
              <ul>
                <li>
                  {diary.emotion_mains && (
                    <>
                      <img src={diary.emotion_mains.icon_url} alt={diary.emotion_mains.name} />
                      {diary.emotion_mains.name}
                    </>
                  )}
                </li>
                {isAuthor && (
                  <li className={S.publicOrNot}>
                    {diary.is_public ? (
                      <>
                        <IoLockOpenOutline />
                        공개
                      </>
                    ) : (
                      <>
                        <IoLockClosedOutline />
                        비공개
                      </>
                    )}
                  </li>
                )}
              </ul>
            </h3>
          </div>

          <p className={S.content}>{diary.content}</p>

          {diary.diary_image && (
            <figure className={S.diaryImage}>
              <img src={diary.diary_image} alt="일기 이미지" />
              <figcaption className="sr-only">일기장 이미지</figcaption>
            </figure>
          )}

          <div className={S.hashtag}>
            {diary.diary_hashtags &&
              diary.diary_hashtags.length > 0 &&
              diary.diary_hashtags.map((dh) => (
                <span key={dh.hashtags.id}>#{dh.hashtags.name}</span>
              ))}
          </div>

          {diary.is_analyzed && <AnalysisResult diaryId={diary.id} isAuthor={isAuthor} />}

          <CommentSection
            comments={comments}
            currentUser={currentUser}
            isLiked={isLiked}
            likesCount={likesCount}
            onLike={handleLike}
            onAddComment={handleAddComment}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
          />
        </div>

        <div className={S.buttonGroup}>
          <button type="button" className={S.bgGrayBtn} onClick={() => navigate('/diary')}>
            목록으로
          </button>
          {isAuthor && (
            <>
              <button type="button" className={S.lineBtn} onClick={handleDeleteClick}>
                삭제
              </button>
              <button
                type="button"
                className={S.bgPrimaryBtn}
                onClick={() => {
                  if (!diary) return;
                  navigate('/diary/form', { state: { diary } });
                }}
              >
                수정
              </button>
            </>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <ConfirmModal
          title="일기 삭제"
          message="정말로 일기를 삭제하시겠습니까?"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          confirmText="삭제"
          cancelText="취소"
        />
      )}
    </main>
  );
};

export default DiaryDetailPage;
