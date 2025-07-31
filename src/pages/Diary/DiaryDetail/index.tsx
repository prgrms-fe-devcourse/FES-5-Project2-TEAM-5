import S from './style.module.css';
import DiaryWeather from '@/shared/components/DiaryWeather';
import { useNavigate, useParams } from 'react-router-dom';
import { formatToSimpleDate } from '@/shared/utils/formatDate';
import Spinner from '@/shared/components/Spinner';
import { useDiaryDetail } from '../DiaryMain/hooks/useDiaryDetail';
import { toastUtils } from '@/shared/components/Toast';
import CommentSection from './components/CommentSection';
import { IoLockClosedOutline, IoLockOpenOutline } from 'react-icons/io5';

const DiaryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    diary,
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

  const onDeleteDiary = async () => {
    if (!id || !window.confirm('정말로 일기를 삭제하시겠습니까?')) {
      return;
    }
    try {
      await handleDelete();
      toastUtils.success({ title: '성공', message: '일기가 성공적으로 삭제되었습니다.' });
      navigate('/diary');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      console.error('일기 삭제 실패:', errorMessage);
      toastUtils.error({ title: '실패', message: '일기 삭제에 실패했습니다.' });
    }
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

  return (
    <main className={S.container}>
      <DiaryWeather />
      <div className={S.inner}>
        <div>
          <div className={S.titleArea}>
            <span className={S.date}>{formatToSimpleDate(diary.created_at)}</span>
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
          <button type="button" className={S.lineBtn} onClick={onDeleteDiary}>
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
        </div>
      </div>
    </main>
  );
};

export default DiaryDetailPage;
