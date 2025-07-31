import { insertChatMessage } from '@/shared/api/chat';
import { toastUtils } from '@/shared/components/Toast';
import { useUserContext } from '@/shared/context/UserContext';
import { useId, useRef } from 'react';
import { IoArrowUpCircleOutline } from 'react-icons/io5';
import style from './style.module.css';

interface Props {
  onOpenChat: () => void;
  disabled: boolean;
}

const ChatInput = ({ onOpenChat, disabled }: Props) => {
  const messageRef = useRef<HTMLInputElement | null>(null);
  const { userInfo } = useUserContext();
  const chatId = useId();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (disabled) return;
    if (!messageRef.current) return;
    const content = messageRef.current.value.trim();
    if (!content) return;
    if (!userInfo) return;

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
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <label htmlFor={chatId} className="sr-only">
        AI와 채팅
      </label>
      <input
        ref={messageRef}
        className={style.chat}
        type="text"
        name="chat"
        id={chatId}
        placeholder="몰리에게 말을 걸어주세요."
        onClick={onOpenChat}
        autoComplete="off"
      />
      <button type="submit" className={style.submitButton} disabled={disabled}>
        <IoArrowUpCircleOutline size={24} />
      </button>
    </form>
  );
};
export default ChatInput;
