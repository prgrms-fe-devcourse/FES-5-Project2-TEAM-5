import S from '../style.module.css';

interface Props {
  content: string;
}

function DiaryViewer({ content }: Props) {
  return (
    <section className={S.diarySection}>
      <h3>내가 선택한 일기</h3>
      <div className={S.diaryBox}>
        <p className={S.content}>{content}</p>
      </div>
    </section>
  );
}

export default DiaryViewer;