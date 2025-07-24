import type { Diary } from '../..';
import S from './style.module.css';

interface Props {
  diary: Diary;
}

const DiaryCardContext = ({ diary }: Props) => {
  const { diary_image, title, content } = diary;
  return (
    <div className={S.main}>
      {diary_image && (
        <figure>
          <img className={S.diaryImage} src={diary_image} alt="일기 이미지" />
        </figure>
      )}
      <section className={S.diaryInfo}>
        <h3 className={S.title}>{title}</h3>
        <p className={S.content}>{content}</p>
      </section>
    </div>
  );
};
export default DiaryCardContext;
