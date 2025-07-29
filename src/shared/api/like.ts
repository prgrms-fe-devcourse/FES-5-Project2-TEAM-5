import supabase from './supabase/client';

/**
 * 모든 diary의 좋아요 수 조회
 */
export const getAllDiariesLikesData = async (
  userId?: string | null,
): Promise<{ likesCount: Record<string, number>; userLikes: Set<string> }> => {
  const { data, error } = await supabase.from('likes').select('diary_id, user_id');

  if (error) {
    throw new Error(`전체 좋아요 데이터 조회 실패: ${error.message}`);
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

export const fetchDiaryInteractions = async (diaryId: string) => {
  const [{ data: likesData, error: likesError }, { data: commentsData, error: commentsError }] =
    await Promise.all([
      supabase.from('likes').select('id', { count: 'exact', head: true }).eq('diary_id', diaryId),
      supabase
        .from('comments')
        .select('id', { count: 'exact', head: true })
        .eq('diary_id', diaryId),
    ]);

  if (likesError || commentsError) {
    throw new Error('다이어리 좋아요/댓글 정보 불러오기 실패');
  }

  const likesCount = (likesData as unknown as { count: number }[])[0]?.count || 0;
  const commentsCount = (commentsData as unknown as { count: number }[])[0]?.count || 0;

  return {
    likesCount,
    commentsCount,
  };
};
