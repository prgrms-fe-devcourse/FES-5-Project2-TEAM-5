import { insertChatMessage } from '@/shared/api/chat';
import { toastUtils } from '@/shared/components/Toast';
import { useUserContext } from '@/shared/context/UserContext';
import React, { useCallback, useId, useRef } from 'react';
import { IoArrowUpCircleOutline } from 'react-icons/io5';
import style from './style.module.css';
import { throttle } from '@/shared/utils/throttle';

interface Props {
  onOpenChat: () => void;
  disabled: boolean;
  isMessageExceeded: boolean;
}

const ChatInput = ({ onOpenChat, disabled, isMessageExceeded }: Props) => {
  const messageRef = useRef<HTMLInputElement | null>(null);
  const { userInfo } = useUserContext();
  const chatId = useId();

  // 채팅 쓰로틀링 제한
  const throttledInsertMessage = useCallback(
    throttle(async (content: string, userId) => {
      try {
        // 메시지 insert
        await insertChatMessage({ content, id: userId });

        // 에러 처리
      } catch (error) {
        if (error instanceof Error) {
          toastUtils.error({ title: '실패', message: error.message });
        } else {
          toastUtils.error({ title: '실패', message: '네트워크 오류 발생' });
        }
      }
    }, 2000),
    [],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onOpenChat();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (disabled) return;
    if (!messageRef.current) return;
    const content = messageRef.current.value.trim();
    if (!content) return;
    if (!userInfo) return;

    throttledInsertMessage(content, userInfo.id);
    messageRef.current!.value = '';
    messageRef.current!.focus();
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
        placeholder={isMessageExceeded ? '몰리가 자리를 비웠어요.' : '몰리에게 말을 걸어주세요.'}
        onClick={onOpenChat}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        disabled={isMessageExceeded}
      />
      <button type="submit" className={style.submitButton} disabled={disabled || isMessageExceeded}>
        <IoArrowUpCircleOutline size={24} />
      </button>
    </form>
  );
};
export default ChatInput;
