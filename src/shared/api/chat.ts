import type { RealtimeChannel } from '@supabase/supabase-js';
import supabase from './supabase/client';
import type { Tables } from './supabase/types';
import { formatUTCToKorean } from '../utils/dateUtils';

/**
 * 채팅 입력 api
 */
export const insertChatMessage = async ({
  id,
  content,
}: {
  id: string;
  content: string;
}): Promise<void> => {
  const { error } = await supabase
    .from('chat_messages')
    .insert({ role: 'user', content, user_id: id });

  if (error) {
    throw new Error('메시지 전송에 실패했습니다.');
  }
};

/**
 * 오늘 날짜 채팅 내역 불러오기
 */
export const fetchTodayChatMessages = async (id: string): Promise<Tables<'chat_messages'>[]> => {
  const [start, end] = formatUTCToKorean();

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', id)
    .gte('created_at', start.toISOString())
    .lt('created_at', end.toISOString())
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error('채팅 내역을 불러올 수 없습니다.');
  }
  return data ?? [];
};

export const createMessageSubscription = (
  userId: string,
  onMessage: (payload: any) => void,
): RealtimeChannel => {
  try {
    return supabase
      .channel(`ai_conversation_${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        onMessage,
      )
      .subscribe();
  } catch (error) {
    throw new Error('채팅 연결 중 문제가 발생했습니다.');
  }
};

export const requestAiResponse = async (userId: string, name: string): Promise<void> => {
  const { error } = await supabase.functions.invoke('conversation_ai', {
    body: { user_id: userId, name },
  });

  if (error) {
    throw new Error('잠시후에 다시 채팅해주세요.');
  }
};
