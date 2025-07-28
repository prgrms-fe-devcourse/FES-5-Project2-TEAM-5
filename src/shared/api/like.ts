import supabase from './supabase/client';

/**
 * 모든 diary의 좋아요 수 조회
 */
export const getAllDiariesLikesCount = async (): Promise<Record<string, number>> => {
  const { data, error } = await supabase.from('likes').select('diary_id');

  if (error) {
    throw new Error('전체 댓글 데이터 조회를 실패했습니다.');
  }

  const likesCount: Record<string, number> = {};
  data.forEach((like) => {
    likesCount[like.diary_id] = (likesCount[like.diary_id] || 0) + 1;
  });

  return likesCount;
};
