import S from './style.module.css';
import { BsArrowRight } from 'react-icons/bs';

const DiaryBanner = () => {
  return (
    <div className={S.banner}>
      <p>
        아직 작성한 일기가 없어요
        <br />
        씨앗 일기를 작성해 보세요!
      </p>
      <button type="button">
        New Diary
        <BsArrowRight size={24} aria-hidden="true" />
      </button>
    </div>
  );
};
export default DiaryBanner;
