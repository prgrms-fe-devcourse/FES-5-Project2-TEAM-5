import S from './style.module.css';

interface Props {
  id: number;
  emotionIcon: string;
  emotionText: string;
  title: string;
  tags: string[];
  likes: number;
  comments: number;
  date: string;
  thumbnail?: string;
}

function DiaryRowCard({
  emotionIcon,
  emotionText,
  title,
  tags,
  likes,
  comments,
  date,
  thumbnail,
}: Props) {
  return (
    <li>
      <a href="#" className={S.container}>
        <div className={S.diaryContents}>
          <span>
            <img src={emotionIcon} alt={emotionText} />
            {emotionText}
          </span>
          <p className={S.title}>{title}</p>
          <ul className={S.tagList}>
            {tags.map((tag) => (
              <li key={tag}>#{tag}</li>
            ))}
          </ul>
          <div className={S.empathy}>
            <span>{likes} Likes</span> · <span>{comments} Comments</span>
          </div>
          <p className={S.date}>{date}</p>
        </div>
        <figure>
          <img src={thumbnail} alt="" />
          <figcaption className="sr-only">일기 첨부 사진</figcaption>
        </figure>
      </a>
    </li>
  );
}

export default DiaryRowCard;
