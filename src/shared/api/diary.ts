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

/**
 * 전체 다이어리 리스트 조회
 */
export const getAllDiaryData = async () => {
  const { data, error } = await supabase.from('diaries').select('*');

  if (error) {
    throw new Error(`전체 다이어리 정보 불러오기 실패: ${error}}`);
    return [];
  }
  return data;
};

/**
 * 특정 날짜의 다이어리 목록 불러오기
 */
export const fetchDiariesByDate = async (
  userId: string,
  startOfDayUTC: string,
  startOfNextDayUTC: string,
) => {
  const { data, error } = await supabase
    .from('diaries')
    .select(
      `
      id, title, created_at, is_public, diary_image,
      emotion_mains(name, icon_url),
      diary_hashtags(hashtags(id, name))
    `,
    )
    .eq('user_id', userId)
    .eq('is_drafted', false)
    .gte('created_at', startOfDayUTC)
    .lt('created_at', startOfNextDayUTC);

  if (error || !data) {
    throw new Error('날짜별 다이어리 불러오기 실패');
  }
  return data;
};

/**
 * 월별 다이어리 작성 날짜 목록 불러오기
 */
export const fetchMonthlyDiaries = async (userId: string, startUTC: string, endUTC: string) => {
  const { data, error } = await supabase
    .from('diaries')
    .select('created_at')
    .eq('user_id', userId)
    .eq('is_drafted', false)
    .gte('created_at', startUTC)
    .lt('created_at', endUTC);

  if (error || !data) {
    throw new Error('월별 다이어리 불러오기 실패');
  }
  return data;
};

/**
 * 기간별 감정 통계 데이터 불러오기
 */
export const fetchEmotionStats = async (userId: string, startUTC: string, endUTC: string) => {
  const { data, error } = await supabase
    .from('diaries')
    .select('emotion_main_id')
    .eq('user_id', userId)
    .eq('is_drafted', false)
    .gte('created_at', startUTC)
    .lt('created_at', endUTC);

  if (error || !data) {
    throw new Error('감정 통계 데이터 불러오기 실패');
  }
  return data;
};
