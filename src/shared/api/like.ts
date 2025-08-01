import supabase from './supabase/client';

/**
 * 모든 diary의 좋아요 수 및 현재 유저의 좋아요 다이어리 조회
 */
export const getAllDiariesLikesData = async (
  userId?: string | null,
): Promise<{ likesCount: Record<string, number>; userLikes: Set<string> }> => {
  const { data, error } = await supabase.from('likes').select('diary_id, user_id');

  if (error) {
    throw new Error('전체 좋아요 데이터 조회 실패');
  }

  const likesCount: Record<string, number> = {};
  const userLikes = new Set<string>();

  data.forEach((like) => {
    likesCount[like.diary_id] = (likesCount[like.diary_id] || 0) + 1;
    if (userId && like.user_id === userId) {
      userLikes.add(like.diary_id);
    }
  });

  return { likesCount, userLikes };
};

/**
 * 특정 diary들의 좋아요 수 및 현재 유저의 좋아요 다이어리 조회
 */
export const getAllDiariesLikesDataByPage = async (
  userId?: string | null,
  diaryIds?: string[],
): Promise<{ likesCount: Record<string, number>; userLikes: Set<string> }> => {
  let query = supabase.from('likes').select('diary_id, user_id');

  // 특정 다이어리 ID들만 조회
  if (diaryIds && diaryIds.length > 0) {
    query = query.in('diary_id', diaryIds);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error('좋아요 데이터 조회 실패');
  }

  const likesCount: Record<string, number> = {};
  const userLikes = new Set<string>();

  data.forEach((like) => {
    likesCount[like.diary_id] = (likesCount[like.diary_id] || 0) + 1;
    if (userId && like.user_id === userId) {
      userLikes.add(like.diary_id);
    }
  });

  return { likesCount, userLikes };
};

/**
 *  특정 diary에 좋아요 추가
 */
export const postLikeToDiary = async (user_id: string, diary_id: string) => {
  const { error } = await supabase.from('likes').insert({ user_id, diary_id });

  if (error) {
    throw new Error('좋아요 추가 실패');
  }
};

/**
 *  특정 diary에 좋아요 제거
 */
export const deleteLikeToDiary = async (user_id: string, diary_id: string) => {
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('diary_id', diary_id)
    .eq('user_id', user_id);

  if (error) {
    throw new Error('좋아요 제거 실패');
  }
};

/**
 * 모든 diary의 좋아요 수 조회
 */
export const getAllDiariesLikesCount = async (): Promise<Record<string, number>> => {
  const { data, error } = await supabase.from('likes').select('diary_id');

  if (error) {
    throw new Error(`전체 좋아요 데이터 조회 실패: ${error.message}`);
    return {};
  }

  const likesCount: Record<string, number> = {};
  data.forEach((like) => {
    likesCount[like.diary_id] = (likesCount[like.diary_id] || 0) + 1;
  });

  return likesCount;
};
