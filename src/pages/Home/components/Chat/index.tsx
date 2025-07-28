import { IoChevronBackOutline } from 'react-icons/io5';
import defaultProfile from '@/assets/defaultProfile.svg';
import molly from '../../assets/molly_profile.svg';
import S from './style.module.css';

interface Props {
  onClose: () => void;
}

const Chat = ({ onClose }: Props) => {
  return (
    <section className={S.chatSection}>
      <header className={S.header}>
        <h2 className="sr-only">채팅창</h2>
        <div className={S.buttonWrapper}>
          <button aria-label="채팅창 닫기" onClick={onClose}>
            <IoChevronBackOutline size={20} />
          </button>
        </div>
        <div className={S.dateWrapper}>
          <h3 className={S.today}>2025년 7월 18일</h3>
        </div>
      </header>
      <div className={S.chatMessage}>
        <div className={S.mollyContainer}>
          <img className={S.profileImage} src={molly} alt="몰리 캐릭터" />
          <p className={S.mollyMessage}>안녕 반가워 나는 몰리야!</p>
        </div>
        <div className={S.userContainer}>
          <p className={S.userMessage}>
            안녕 반가워 나는 짱아야! ㅎㅎ안녕 반가워 나는 짱아야! ㅎㅎ안녕 반가워 나는 짱아야!
            ㅎㅎ안녕 반가워 나는 짱아야! ㅎㅎ안녕 반가워 나는 짱아야! ㅎㅎ안녕 반가워 나는 짱아야!
            ㅎㅎ안녕 반가워 나는 짱아야! ㅎㅎ
          </p>
          <img className={S.profileImage} src={defaultProfile} alt="몰리 캐릭터" />
        </div>
        <div className={S.mollyContainer}>
          <img className={S.profileImage} src={molly} alt="몰리 캐릭터" />
          <p className={S.mollyMessage}>안녕 반가워 나는 몰리야!</p>
        </div>
        <div className={S.userContainer}>
          <p className={S.userMessage}>
            안녕 반가워 나는 짱아야! ㅎㅎ안녕 반가워 나는 짱아야! ㅎㅎ안녕 반가워 나는 짱아야!
            ㅎㅎ안녕 반가워 나는 짱아야! ㅎㅎ안녕 반가워 나는 짱아야! ㅎㅎ안녕 반가워 나는 짱아야!
            ㅎㅎ안녕 반가워 나는 짱아야! ㅎㅎ
          </p>
          <img className={S.profileImage} src={defaultProfile} alt="몰리 캐릭터" />
        </div>
        <div className={S.mollyContainer}>
          <img className={S.profileImage} src={molly} alt="몰리 캐릭터" />
          <p className={S.mollyMessage}>안녕 반가워 나는 몰리야!</p>
        </div>
        <div className={S.userContainer}>
          <p className={S.userMessage}>
            안녕 반가워 나는 짱아야! ㅎㅎ안녕 반가워 나는 짱아야! ㅎㅎ안녕 반가워 나는 짱아야!
            ㅎㅎ안녕 반가워 나는 짱아야! ㅎㅎ안녕 반가워 나는 짱아야! ㅎㅎ안녕 반가워 나는 짱아야!
            ㅎㅎ안녕 반가워 나는 짱아야! ㅎㅎ
          </p>
          <img className={S.profileImage} src={defaultProfile} alt="몰리 캐릭터" />
        </div>
        <div className={S.mollyContainer}>
          <img className={S.profileImage} src={molly} alt="몰리 캐릭터" />
          <p className={S.mollyMessage}>안녕 반가워 나는 몰리야!</p>
        </div>
        <div className={S.userContainer}>
          <p className={S.userMessage}>
            안녕 반가워 나는 짱아야! ㅎㅎ안녕 반가워 나는 짱아야! ㅎㅎ안녕 반가워 나는 짱아야!
            ㅎㅎ안녕 반가워 나는 짱아야! ㅎㅎ안녕 반가워 나는 짱아야! ㅎㅎ안녕 반가워 나는 짱아야!
            ㅎㅎ안녕 반가워 나는 짱아야! ㅎㅎ
          </p>
          <img className={S.profileImage} src={defaultProfile} alt="몰리 캐릭터" />
        </div>
        <div className={S.mollyContainer}>
          <img className={S.profileImage} src={molly} alt="몰리 캐릭터" />
          <p className={S.mollyMessage}>안녕 반가워 나는 몰리야!</p>
        </div>
        <div className={S.userContainer}>
          <p className={S.userMessage}>
            안녕 반가워 나는 짱아야! ㅎㅎ안녕 반가워 나는 짱아야! ㅎㅎ안녕 반가워 나는 짱아야!
            ㅎㅎ안녕 반가워 나는 짱아야! ㅎㅎ안녕 반가워 나는 짱아야! ㅎㅎ안녕 반가워 나는 짱아야!
            ㅎㅎ안녕 반가워 나는 짱아야! ㅎㅎ
          </p>
          <img className={S.profileImage} src={defaultProfile} alt="몰리 캐릭터" />
        </div>
        <div className={S.mollyContainer}>
          <img className={S.profileImage} src={molly} alt="몰리 캐릭터" />
          <div className={S.typingIndicator}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Chat;
