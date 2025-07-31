import type { Quest } from '../types/quest';
import { formatUTCToKorean } from '../utils/dateUtils';
import supabase from './supabase/client';

/**
 * 내가 수락한 퀘스트 불러오기
 */
export const getTodayAcceptedQuestList = async (userId: string): Promise<Quest[] | []> => {
  const [start, end] = formatUTCToKorean();

  const { data, error } = await supabase
    .from('user_accepted_quests')
    .select('* , quests(title, content)')
    .gte('accepted_at', start.toISOString())
    .lt('accepted_at', end.toISOString())
    .eq('user_id', userId);
  if (error) {
    throw new Error('퀘스트 불러오기 실패');
  }

  return data;
};

/**
 * 퀘스트 완료
 */
export const updateQuestState = async (questId: number, userId: string, status: boolean) => {
  const { error } = await supabase
    .from('user_accepted_quests')
    .update({ is_completed: !status })
    .eq('quest_id', questId)
    .eq('user_id', userId);

  if (error) {
    throw new Error('퀘스트 상태 업데이트 실패');
  }
};
