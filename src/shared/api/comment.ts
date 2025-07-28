import supabase from './supabase/client';

/**
 * 모든 diary의 댓글 수 조회
 */
export const getAllDiariesCommentsCount = async (): Promise<Record<string, number>> => {
  const { data, error } = await supabase.from('comments').select('diary_id');

  if (error) {
    throw new Error(`전체 댓글 데이터 조회 실패: ${error.message}`);
    return {};
  }

  const commentsCount: Record<string, number> = {};
  data.forEach((comment) => {
    commentsCount[comment.diary_id] = (commentsCount[comment.diary_id] || 0) + 1;
  });

  return commentsCount;
};
