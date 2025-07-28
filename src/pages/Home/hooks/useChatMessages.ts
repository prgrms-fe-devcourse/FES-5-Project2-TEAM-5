import {
  createMessageSubscription,
  fetchTodayChatMessages,
  requestAiResponse,
} from '@/shared/api/chat';
import type { Tables } from '@/shared/api/supabase/types';
import type { RealtimePostgresInsertPayload } from '@supabase/supabase-js';
import { useEffect, useState, useTransition } from 'react';

export const useChatMessages = (userId: string, name: string) => {
  const [messages, setMessages] = useState<Tables<'chat_messages'>[]>([]);
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>('');

  // 초기 메시지 fetch
  useEffect(() => {
    startTransition(async () => {
      try {
        const message = await fetchTodayChatMessages(userId);
        setMessages(message);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('메시지를 불러오는데 실패했습니다.');
        }
      }
    });
  }, [userId]);

  // 실시간 채팅
  useEffect(() => {
    try {
      const subscription = createMessageSubscription(userId, handleNewMessage);

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  }, [userId]);

  const handleNewMessage = (
    payload: RealtimePostgresInsertPayload<{
      [key: string]: any;
    }>,
  ) => {
    const { content, created_at, id, role, user_id } = payload.new as Tables<'chat_messages'>;
    setMessages((prev) => [...prev, { id, created_at, content, user_id, role }]);

    if (role === 'user') {
      setIsAiTyping(true);
      requestAiResponse(userId, name);
    }
    if (role === 'model') {
      setIsAiTyping(false);
    }
  };

  return {
    messages,
    isAiTyping,
    error,
    isLoading: isPending,
  };
};
