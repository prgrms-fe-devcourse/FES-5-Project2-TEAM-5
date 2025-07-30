import type { DiaryRowEntity } from '@/shared/types/diary';
import S from './style.module.css';
import { formatToReadableDate } from '@/shared/utils/formatDate';
import { useNavigate } from 'react-router-dom';

function DiaryRowCard({
  id,
  comments,
  created_at,
  diary_hashtags,
  diary_image,
  emotion_mains,
  likes,
  title,
  is_analyzed,
}: DiaryRowEntity) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(`/diary/${id}`);
  };

  return (
    <li className={S.rowCard}>
      {is_analyzed && <div className={S.overlay} />}
      <a href={`/diary/${id}`} className={S.container} onClick={handleClick}>
        <div className={S.diaryContents}>
          <span>
            {emotion_mains.icon_url && (
              <img src={emotion_mains.icon_url || ''} alt={emotion_mains.name || '감정'} />
            )}

            {emotion_mains.name}
          </span>
          <p className={S.title}>{title}</p>
          <ul className={S.tagList}>
            {diary_hashtags.map((tag) => (
              <li key={tag.id}>#{tag.name}</li>
            ))}
          </ul>
          <div className={S.empathy}>
            <span>{likes} Likes</span> · <span>{comments} Comments</span>
          </div>
          <p className={S.date}>{formatToReadableDate(created_at)}</p>
        </div>
        <figure>
          {diary_image && (
            <>
              <img className={S.thumbImage} src={diary_image} alt="" />
              <figcaption className="sr-only">일기 첨부 사진</figcaption>
            </>
          )}
        </figure>
      </a>
    </li>
  );
}

export default DiaryRowCard;
