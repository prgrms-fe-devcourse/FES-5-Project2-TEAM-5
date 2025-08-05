import type { Diary } from '@/shared/types/diary';
import S from './style.module.css';
import type { Hashtag } from '@/shared/types/hashtag';
import { truncateText } from '@/shared/utils/truncateText';

interface Props {
  diary: Diary;
  hashtags: Hashtag[];
}

const DiaryCardContent = ({ diary, hashtags }: Props) => {
  const { diary_image, title, content } = diary;
  return (
    <div className={S.content}>
      {diary_image && (
        <figure className={S.imageContainer}>
          <img className={S.diaryImage} src={diary_image} alt="일기 이미지" />
        </figure>
      )}
      <section className={S.diaryInfo}>
        <h3 className={S.title}>{title}</h3>
        {hashtags.length > 0 && (
          <div className={S.hashtags}>
            {hashtags.map((tag) => (
              <span key={tag.id} className={S.tag}>
                #{tag.name}
              </span>
            ))}
          </div>
        )}
        <p className={S.contentText}>{truncateText(content, 100)}</p>
      </section>
    </div>
  );
};
export default DiaryCardContent;
