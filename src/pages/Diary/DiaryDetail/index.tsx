import S from './style.module.css';
import { useState } from 'react';
import { IoArrowUpCircleOutline, IoLockClosedOutline, IoLockOpenOutline } from 'react-icons/io5';
import { BsChat } from 'react-icons/bs';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import DiaryWeather from '@/shared/components/DiaryWeather';
import { useNavigate, useParams } from 'react-router-dom';
import { useDiaryDetail } from '../DiaryMain/hooks/useDiaryDetail';
import { formatToSimpleDate } from '@/shared/utils/formatDate';
import Spinner from '@/shared/components/Spinner';

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
    handleLike,
    handleAddComment,
    handleDelete,
  } = useDiaryDetail(id);

  const [newCommentInput, setNewCommentInput] = useState('');

  const onAddComment = () => {
    handleAddComment(newCommentInput);
    setNewCommentInput('');
  };

  const onDeleteDiary = async () => {
    if (!id || !window.confirm('정말로 일기를 삭제하시겠습니까?')) {
      return;
    }
    try {
      await handleDelete();
      alert('일기가 성공적으로 삭제되었습니다.');
      navigate('/diary');
    } catch (err: any) {
      console.error('일기 삭제 실패:', err.message);
      alert('일기 삭제에 실패했습니다: ' + err.message);
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
                  <img src={diary.emotion_mains.icon_url} alt={diary.emotion_mains.name} />
                  {diary.emotion_mains.name}
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
              diary.diary_hashtags.map((h) => <span key={h.hashtags.id}>#{h.hashtags.name}</span>)}
          </div>

          <section className={S.commnetArea}>
            <h4 className="sr-only">댓글 영역</h4>
            <div className={S.commentHead}>
              <span>
                <BsChat size={20} />
                댓글 {comments.length}
              </span>
              <button onClick={handleLike}>
                {isLiked ? <IoMdHeart color="red" size={24} /> : <IoMdHeartEmpty size={24} />}
                {likesCount}
              </button>
            </div>

            <div className={S.commentBox}>
              {comments.length > 0 ? (
                <div className={S.commnetItem}>
                  {comments.map((comment) => (
                    <div key={comment.id}>
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
                          <span className={S.createDate}>{comment.timestamp}</span>
                        </div>
                        <p className={S.commnetContent}>{comment.content}</p>
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
                    if (e.key === 'Enter') onAddComment();
                  }}
                />
                <button onClick={onAddComment} className={S.commentBtn}>
                  <IoArrowUpCircleOutline size={24} />
                </button>
              </div>
            </div>
          </section>
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
