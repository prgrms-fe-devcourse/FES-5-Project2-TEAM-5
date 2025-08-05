import {
  createMessageSubscription,
  fetchTodayChatMessages,
  requestAiResponse,
} from '@/shared/api/chat';
import type { Tables } from '@/shared/api/supabase/types';
import { useUserContext } from '@/shared/context/UserContext';
import type { RealtimePostgresInsertPayload } from '@supabase/supabase-js';
import { useEffect, useState, useTransition } from 'react';
import { useChatScroll } from './useChatScroll';

export const useChatMessages = () => {
  const { userInfo } = useUserContext();
  const [messages, setMessages] = useState<Tables<'chat_messages'>[]>([]);
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>('');
  const MAX_MESSAGE_COUNT = 102;

  // 초기 메시지 fetch
  useEffect(() => {
    if (!userInfo?.id) return;
    startTransition(async () => {
      try {
        const message = await fetchTodayChatMessages(userInfo.id);
        setMessages(message);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('메시지를 불러오는데 실패했습니다.');
        }
      }
    });
  }, [userInfo?.id]);

  // 실시간 채팅
  useEffect(() => {
    if (!userInfo?.id) return;
    try {
      const subscription = createMessageSubscription(userInfo.id, handleNewMessage);

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  }, [userInfo?.id]);

  // 새 메시지 업데이트
  const handleNewMessage = (
    payload: RealtimePostgresInsertPayload<{
      [key: string]: any;
    }>,
  ) => {
    if (!userInfo?.id) return;
    const { content, created_at, id, role, user_id, is_system } =
      payload.new as Tables<'chat_messages'>;
    setMessages((prev) => [...prev, { id, created_at, content, user_id, role, is_system }]);

    // 유저 메시지 insert 감지
    if (role === 'user') {
      setIsAiTyping(true);
      requestAiResponse(userInfo.id, userInfo.name);
    }
    // AI 메시지 insert 감지
    if (role === 'model') {
      setIsAiTyping(false);
    }
  };

  // 스크롤 추적
  const ref = useChatScroll(messages, isAiTyping);

  return {
    messages,
    isAiTyping,
    error,
    isLoading: isPending,
    ref: ref,
    userProfileUrl: userInfo?.profile_image,
    isMessageExceeded: messages.length >= MAX_MESSAGE_COUNT,
  };
};
