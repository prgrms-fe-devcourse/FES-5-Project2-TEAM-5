import S from './style.module.css';
import molly from '../../assets/molly_profile.svg';

const TypingIndicator = () => {
  return (
    <div className={S.modalContainer}>
      <img className={S.profileImage} src={molly} alt="몰리 캐릭터" />
      <div className={S.typingIndicator}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};
export default TypingIndicator;
