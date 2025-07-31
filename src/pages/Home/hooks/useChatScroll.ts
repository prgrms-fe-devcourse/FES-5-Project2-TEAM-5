import type { Tables } from '@/shared/api/supabase/types';
import { useEffect, useRef } from 'react';

export const useChatScroll = (messages: Tables<'chat_messages'>[], isAiTyping: boolean) => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = (smooth = false) => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        behavior: smooth ? 'smooth' : 'instant',
        top: messagesContainerRef.current.scrollHeight,
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => scrollToBottom(true), 50);
    return () => clearTimeout(timer);
  }, [messages, isAiTyping]);

  return messagesContainerRef;
};
