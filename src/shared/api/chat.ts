import type { RealtimeChannel } from '@supabase/supabase-js';
import supabase from './supabase/client';
import type { Tables } from './supabase/types';
import { formatUTCToKorean, getLocalDateString } from '../utils/dateUtils';
import { limitMessages } from '../constants/chat';

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

/**
 * 실시간 채팅 연결
 */
export const createMessageSubscription = (
  userId: string,
  onMessage: (payload: any) => void,
): RealtimeChannel => {
  try {
    return supabase
      .channel(`ai_conversation_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `user_id=eq.${userId}`,
        },
        onMessage,
      )
      .subscribe();
  } catch (error) {
    throw new Error('채팅 연결 중 문제가 발생했습니다.');
  }
};

/**
 * 수파 베이스 edge func 호출
 */
export const requestAiResponse = async (userId: string, name: string): Promise<void> => {
  const { error } = await supabase.functions.invoke('conversation_ai', {
    body: { user_id: userId, name },
  });

  if (error) {
    throw new Error('잠시후에 다시 채팅해주세요.');
  }
};

/**
 * 첫 로그인 시 chat_session 데이터 생성
 * AI와 대화 메시지 리미트를 위한 설정
 */
export const createChatSession = async (userId: string): Promise<void> => {
  const today = getLocalDateString(new Date());
  const randomPairId = Math.floor(Math.random() * limitMessages.length) + 1; // 메시지 페어는 4가지

  const { error } = await supabase.from('user_chat_session').upsert({
    user_id: userId,
    last_reset_date: today,
    message_count: 0,
    daily_limit: 50,
    warning_threshold: 45,
    selected_message_pair_id: randomPairId,
    warning_sent: false,
  });

  if (error) {
    throw new Error('user_chat_session 생성 에러');
  }
};

/**
 * 매사자 카운트
 */
export const getTodayMessageCount = async (userId: string) => {
  const { data: limit, error: selectError } = await supabase
    .from('user_chat_session')
    .select('message_count, daily_limit')
    .eq('user_id', userId)
    .single();
  if (selectError || !limit) {
    throw new Error('daily limit selectError 발생');
  }

  return limit;
};

/**
 * 사용자가 chat insert 성공시 daily_limit + 1 업데이트
 */
export const updateMessageCount = async (userId: string) => {
  const limit = await getTodayMessageCount(userId);

  const { error: updateError } = await supabase
    .from('user_chat_session')
    .update({ message_count: limit.message_count + 1 })
    .eq('user_id', userId);

  if (updateError) {
    throw new Error('daily limit updateError 발생');
  }
};

/**
 * 마지막 채팅 세션 업데이트 날짜 가져오기
 */
export const getLastChatSessionDate = async (userId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('user_chat_session')
    .select('last_reset_date')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw new Error('user_chat_session 마지막 업데이트 날짜 불러오기 에러');
  }

  return data?.last_reset_date ?? null;
};

/**
 * 마지막 세션 업데이트 날짜로 세션 초기화
 */
export const initializedChatSession = async (userId: string): Promise<void> => {
  try {
    const today = getLocalDateString(new Date());
    const lastUpdateData = await getLastChatSessionDate(userId);

    if (!lastUpdateData || lastUpdateData < today) {
      await createChatSession(userId);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};
