import supabase from './supabase/client';
import type { Tables } from './supabase/types';

/**
 * emotion_mains 전체 조회
 */
export const getAllEmotionMains = async (): Promise<Tables<'emotion_mains'>[]> => {
  const { data, error } = await supabase
    .from('emotion_mains')
    .select()
    .order('id', { ascending: true });

  if (error || !data) {
    throw new Error(`emotion 데이터 불러오기를 실패: ${error.message}`);
  }
  return data;
};
