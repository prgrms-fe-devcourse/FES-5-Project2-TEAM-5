import style from './style.module.css';
import molly from '../../assets/molly_profile.svg';

const TypingIndicator = () => {
  return (
    <div className={style.modalContainer}>
      <img className={style.profileImage} src={molly} alt="몰리 캐릭터" />
      <div className={style.typingIndicator}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};
export default TypingIndicator;
