import type { Tables } from '@/shared/api/supabase/types';
import Spinner from '@/shared/components/Spinner';
import { formatToKoreaDate } from '@/shared/utils/formatDate';
import { useEffect, type RefObject } from 'react';
import { IoChevronBackOutline } from 'react-icons/io5';
import MessageItem from '../MessageItem';
import TypingIndicator from '../TypingIndicator';
import style from './style.module.css';

interface Props {
  onClose: () => void;
  messages: Tables<'chat_messages'>[];
  isLoading: boolean;
  ref: RefObject<HTMLDivElement | null>;
  isAiTyping: boolean;
  userProfileUrl: string | null;
}

const ChatMessages = ({ onClose, messages, isLoading, ref, isAiTyping, userProfileUrl }: Props) => {
  //  채팅창 스크롤 맨 아래로
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({ behavior: 'instant', top: ref.current.scrollHeight });
    }
  }, []);

  if (isLoading) {
    return (
      <section className={style.chatSection}>
        <Spinner />
      </section>
    );
  }

  return (
    <section className={style.chatSection}>
      <header className={style.header}>
        <h2 className="sr-only">채팅창</h2>
        <div className={style.buttonWrapper}>
          <button type="button" aria-label="채팅창 닫기" onClick={onClose}>
            <IoChevronBackOutline size={20} />
          </button>
        </div>
        <div className={style.dateWrapper}>
          <h3 className={style.today}>{formatToKoreaDate(new Date())}</h3>
        </div>
      </header>
      <div className={style.chatMessage} ref={ref}>
        {messages.length > 0 ? (
          // 메시지 리스트 출력
          messages.map((message) => (
            <MessageItem message={message} userProfileUrl={userProfileUrl} key={message.id} />
          ))
        ) : (
          // message 내역 없음
          <div className={style.emptyMessage} role="status" aria-live="polite">
            <span>채팅 씹힘이 있을 수 있습니다..</span>
            <span>🥹</span>
          </div>
        )}
        {/* AI 타이핑 애니메이션 */}
        {isAiTyping && <TypingIndicator />}
      </div>
    </section>
  );
};
export default ChatMessages;
