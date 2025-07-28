import type { DiaryRowEntity } from '../types/diary';
import { transformDiaryData } from '../utils/formatSupabase';
import supabase from './supabase/client';

/**
 * 유저 아이디로 다이러리 리스트 불러오기
 */
export const getDiariesById = async (id: string): Promise<DiaryRowEntity[]> => {
  const { data, error } = await supabase
    .from('diaries')
    .select(
      'id, title, created_at, is_public,diary_image,emotion_mains(name, icon_url),diary_hashtags(hashtags(id,name)),likes(count),comments(count)',
    )
    .eq('id', id);

  if (error || !data) {
    throw new Error('다이어리 리스트를 불러오기 실패');
  }
  return transformDiaryData(data);
};
