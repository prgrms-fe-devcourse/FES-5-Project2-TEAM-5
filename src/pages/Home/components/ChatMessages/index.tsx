import { useUserContext } from '@/shared/context/UserContext';
import { IoChevronBackOutline } from 'react-icons/io5';
import { useChatMessages } from '../../hooks/useChatMessages';
import MessageItem from '../MessageItem';
import TypingIndicator from '../TypingIndicator';
import S from './style.module.css';
import { formatToKoreaDate } from '@/shared/utils/formatDate';
import Spinner from '@/shared/components/Spinner';

interface Props {
  onClose: () => void;
}

const ChatMessages = ({ onClose }: Props) => {
  const { userInfo } = useUserContext();

  if (!userInfo) {
    return (
      <section className={S.chatSection}>
        <Spinner />
      </section>
    );
  }

  const { messages, isAiTyping, isLoading, error } = useChatMessages(userInfo.id, userInfo.name);

  if (isLoading) {
    return (
      <section className={S.chatSection}>
        <Spinner />
      </section>
    );
  }

  return (
    <section className={S.chatSection}>
      <header className={S.header}>
        <h2 className="sr-only">채팅창</h2>
        <div className={S.buttonWrapper}>
          <button type="button" aria-label="채팅창 닫기" onClick={onClose}>
            <IoChevronBackOutline size={20} />
          </button>
        </div>
        <div className={S.dateWrapper}>
          <h3 className={S.today}>{formatToKoreaDate(new Date())}</h3>
        </div>
      </header>
      <div className={S.chatMessage}>
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageItem
              message={message}
              userProfileUrl={userInfo.profile_image}
              key={message.id}
            />
          ))
        ) : (
          <div className={S.emptyMessage} role="status" aria-live="polite">
            <span>오늘 몰리와 대화를 하지 않았어요.</span>
            <span> 몰리에게 말을 건내보세요!</span>
          </div>
        )}
        {isAiTyping && <TypingIndicator />}
      </div>
    </section>
  );
};
export default ChatMessages;
