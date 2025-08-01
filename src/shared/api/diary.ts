import type { DiaryDetailEntity, DiaryRowEntity, SupabaseDiaryResponse } from '../types/diary';
import { transformDiaryData } from '../utils/formatSupabase';
import { getAllDiariesLikesData } from './like';
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
  const { data, error } = await supabase
    .from('diaries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`전체 다이어리 정보 불러오기 실패: ${error}}`);
    return [];
  }
  return data;
};

/**
 * 전체 다이어리 리스트 조회 (페이지네이션 및 필터링 지원)
 */
export const getAllDiaryDataByPage = async (
  page: number = 1,
  limit: number = 20,
  filters?: {
    search?: string;
    emotions?: number[];
    userId?: string;
  },
) => {
  const isHashtagSearch = filters?.search?.trim().startsWith('#');

  // 기본 쿼리 설정
  let query = supabase
    .from('diaries')
    .select(
      isHashtagSearch
        ? `*, diary_hashtags!inner(hashtags!inner(name))`
        : `*, diary_hashtags(hashtags(name))`,
    )
    .eq('is_public', true)
    .eq('is_drafted', false)
    .order('created_at', { ascending: false });

  // 검색 조건 적용
  if (filters?.search?.trim()) {
    const searchTerm = filters.search.trim();

    if (isHashtagSearch) {
      // 해시태그 검색
      const hashtagName = searchTerm.slice(1).trim();
      if (hashtagName) {
        query = query.eq('diary_hashtags.hashtags.name', hashtagName);
      }
    } else {
      // 일반 검색 (제목, 내용)
      const searchTerms = searchTerm
        .toLowerCase()
        .split(' ')
        .filter((term) => term.length > 0);

      if (searchTerms.length > 0) {
        const searchConditions = searchTerms
          .map((term) => `title.ilike.%${term}%,content.ilike.%${term}%`)
          .join(',');

        query = query.or(searchConditions);
      }
    }
  }

  // 감정 필터링
  if (filters?.emotions && filters.emotions.length > 0) {
    query = query.in('emotion_main_id', filters.emotions);
  }

  // 페이지네이션
  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1);

  // 쿼리 실행
  const { data, error } = await query;

  if (error) {
    const searchType = isHashtagSearch ? '해시태그' : '일반';
    throw new Error(`${searchType} 검색 실패: ${error.message}`);
  }

  return data || [];
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
    .lt('created_at', startOfNextDayUTC)
    .order('created_at', { ascending: false });

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
export const getDiaryDetailById = async (diaryId: string): Promise<DiaryDetailEntity> => {
  const { data, error } = await supabase
    .from('diaries')
    .select(
      `
      *,
      emotion_mains(*),
      diary_hashtags(hashtags(*)), 
      likes(*),
      comments(*)
    `,
    )
    .eq('id', diaryId)
    .single();

  if (error || !data) {
    throw new Error('일기 상세 정보 불러오기 실패');
  }

  // 타입 변환
  const transformedData: DiaryDetailEntity = {
    ...data,
    likes_count: Array.isArray(data.likes) ? data.likes.length : 0,
    comments_count: Array.isArray(data.comments) ? data.comments.length : 0,
  };

  return transformedData;
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
 * 특정 사용자가 특정 일기에 좋아요했는지 확인
 */
export const checkUserLikedDiary = async (diaryId: string, userId: string) => {
  try {
    const { userLikes } = await getAllDiariesLikesData(userId);
    return userLikes.has(diaryId);
  } catch (error) {
    console.error('좋아요 상태 확인 에러:', error);
    return false;
  }
};

/**
 * 특정 사용자가 작성한 전체 일기 불러오기
 */
export const getUserDiaries = async (userId: string, page: number = 1, limit: number = 20) => {
  const offset = (page - 1) * limit;
  const { data, error } = await supabase
    .from('diaries')
    .select(
      `
    id,
    title,
    created_at,
    diary_image,
    is_public,
    is_drafted,
    emotion_mains (
      icon_url,
      name
    ),
    diary_hashtags (
      hashtags (
        id,
        name
      )
    ),
    likes (
      id
    ),
    comments (
      id
    )
  `,
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`관계 포함 다이어리 조회 실패`);
  }

  const result = data.map((diary) => ({
    ...diary,
    likes: Array.isArray(diary.likes) ? diary.likes.length : 0,
    comments: Array.isArray(diary.comments) ? diary.comments.length : 0,
    emotion_mains: Array.isArray(diary.emotion_mains)
      ? diary.emotion_mains[0]
      : diary.emotion_mains,
    diary_hashtags: diary.diary_hashtags?.flatMap((h) => h.hashtags) || [],
  }));

  return result;
};

/**
 * 특정 사용자가 좋아요한 전체 일기 불러오기
 */
export const getUserLikedDiaries = async (userId: string, page: number = 1, limit: number = 20) => {
  const offset = (page - 1) * limit;
  const { data, error } = await supabase
    .from('likes')
    .select(
      `
      diary_id,
      diaries (
        id,
        title,
        created_at,
        diary_image,
        is_public,
        is_drafted,
        emotion_mains (
          icon_url,
          name
        ),
        diary_hashtags (
          hashtags (
            id,
            name
          )
        ),
        likes (
          id
        ),
        comments (
          id
        )
      )
    `,
    )
    .eq('user_id', userId)
    .range(offset, offset + limit - 1);

  if (error) throw new Error(`좋아요한 다이어리 조회 실패`);

  const result = data
    .map((like) => like.diaries)
    .filter(Boolean)
    .map((diary) => ({
      ...diary,
      likes: Array.isArray(diary.likes) ? diary.likes.length : 0,
      comments: Array.isArray(diary.comments) ? diary.comments.length : 0,
      emotion_mains: Array.isArray(diary.emotion_mains)
        ? diary.emotion_mains[0]
        : diary.emotion_mains,
      diary_hashtags: diary.diary_hashtags?.flatMap((h) => h.hashtags) || [],
    }))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return result;
};

/**
 * 특정 사용자가 댓글단 전체 일기 불러오기
 */
export const getUserCommentedDiaries = async (
  userId: string,
  page: number = 1,
  limit: number = 20,
) => {
  const offset = (page - 1) * limit;
  const { data, error } = await supabase
    .from('comments')
    .select(
      `
      diary_id,
      diaries (
        id,
        title,
        created_at,
        diary_image,
        is_public,
        is_drafted,
        emotion_mains (
          icon_url,
          name
        ),
        diary_hashtags (
          hashtags (
            id,
            name
          )
        ),
        likes (
          id
        ),
        comments (
          id
        )
      )
    `,
    )
    .eq('user_id', userId)
    .range(offset, offset + limit - 1);

  if (error) throw new Error(`댓글단 다이어리 조회 실패`);

  const result = data
    .map((like) => like.diaries)
    .filter(Boolean)
    .map((diary) => ({
      ...diary,
      likes: Array.isArray(diary.likes) ? diary.likes.length : 0,
      comments: Array.isArray(diary.comments) ? diary.comments.length : 0,
      emotion_mains: Array.isArray(diary.emotion_mains)
        ? diary.emotion_mains[0]
        : diary.emotion_mains,
      diary_hashtags: diary.diary_hashtags?.flatMap((h) => h.hashtags) || [],
    }))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return result;
};
