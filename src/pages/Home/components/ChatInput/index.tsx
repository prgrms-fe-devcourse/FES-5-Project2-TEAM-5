import { useId, useRef, useTransition } from 'react';
import S from './style.module.css';
import { IoArrowUpCircleOutline } from 'react-icons/io5';
import { useUserContext } from '@/shared/context/UserContext';
import { insertChatMessage } from '@/shared/api/chat';
import { toastUtils } from '@/shared/components/Toast';

interface Props {
  onOpenChat: () => void;
}

const ChatInput = ({ onOpenChat }: Props) => {
  const messageRef = useRef<HTMLInputElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const { userInfo } = useUserContext();
  const chatId = useId();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!messageRef.current) return;
    const content = messageRef.current.value.trim();
    if (!content) return;
    if (!userInfo) return;

    startTransition(async () => {
      try {
        await insertChatMessage({ content, id: userInfo.id });
        messageRef.current!.value = '';
        messageRef.current!.focus();
      } catch (error) {
        if (error instanceof Error) {
          toastUtils.error({ title: '실패', message: error.message });
        } else {
          toastUtils.error({ title: '실패', message: '네트워크 오류 발생' });
        }
      }
    });
  };

  return (
    <form className={S.form} onSubmit={handleSubmit}>
      <label htmlFor={chatId} className="sr-only">
        AI와 채팅
      </label>
      <input
        ref={messageRef}
        className={S.chat}
        type="text"
        name="chat"
        id={chatId}
        placeholder="몰리에게 말을 걸어주세요."
        onClick={onOpenChat}
        autoComplete="off"
      />
      <button type="submit" className={S.submitButton} disabled={isPending}>
        <IoArrowUpCircleOutline size={24} />
      </button>
    </form>
  );
};
export default ChatInput;
