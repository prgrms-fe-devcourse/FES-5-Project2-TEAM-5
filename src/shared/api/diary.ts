import type { DiaryRowEntity, SupabaseDiaryResponse, UpdateDiaryData } from '../types/diary';
import { transformDiaryData } from '../utils/formatSupabase';
import supabase from './supabase/client';

/**
 * 유저 아이디로 다이러리 리스트 불러오기
 */
export const getDiariesById = async (id: string): Promise<DiaryRowEntity[]> => {
  const { data, error } = await supabase
    .from('diaries')
    .select(
      'id, title, created_at, is_public,diary_image, is_analyzed,emotion_mains(name, icon_url),diary_hashtags(hashtags(id,name)),likes(count),comments(count)',
    )
    .eq('user_id', id);

  if (error || !data) {
    throw new Error('다이어리 리스트를 불러오기 실패');
  }

  return transformDiaryData(data as SupabaseDiaryResponse[]);
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

/**
 * 특정 일기의 상세 정보 불러오기
 */
export const getDiaryDetailById = async (diaryId: string) => {
  const { data, error } = await supabase
    .from('diaries')
    .select(
      `
      id, title, content, created_at, is_public, diary_image,
      emotion_mains(id, name, icon_url),
      diary_hashtags(hashtags(id, name)), 
      ikes:likes(count),comments:comments(count)
    `,
    )
    .eq('id', diaryId)
    .single();

  if (error || !data) {
    throw new Error('일기 상세 정보 불러오기 실패');
  }
  return data;
};

/**
 * 특정 일기 삭제하기
 */
export const deleteDiaryById = async (diaryId: string) => {
  const { error } = await supabase.from('diaries').delete().eq('id', diaryId);

  if (error) {
    throw new Error('일기 삭제 실패');
  }
  return true;
};

/**
 * 현재 사용자가 특정 일기에 좋아요를 했는지 확인
 */
export const checkUserLikedDiary = async (diaryId: string, userId: string) => {
  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .eq('diary_id', diaryId)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116: no rows returned
    throw new Error('좋아요 상태 확인 실패');
  }

  return !!data;
};

export const updateDiaryById = async (diaryId: string, updateData: SupabaseDiaryResponse) => {
  try {
    const { data, error } = await supabase
      .from('diaries')
      .update({
        title: updateData.title,
        content: updateData.content,
        is_public: updateData.is_public,
        updated_at: new Date().toISOString(),
      })
      .eq('id', diaryId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    console.error('일기 수정 Supabase 에러:', error);
    throw new Error(error.message || '일기 수정에 실패했습니다.');
  }
};
