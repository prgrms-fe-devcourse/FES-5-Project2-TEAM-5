import type { DiaryRowEntity } from '@/shared/types/diary';
import S from './style.module.css';
import { formatToReadableDate } from '@/shared/utils/formatDate';

function DiaryRowCard({
  comments,
  created_at,
  diary_hashtags,
  diary_image,
  emotion_mains,
  likes,
  title,
}: DiaryRowEntity) {
  return (
    <li>
      <a href="#" className={S.container}>
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
