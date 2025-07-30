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

// 댓글 알림
export const postCommentNotification = async (
  receiverId: string,
  senderId: string,
  diaryId: string,
  senderName: string,
) => {
  const { error } = await supabase.from('notifications').insert({
    user_id: receiverId,
    sender_id: senderId,
    diary_id: diaryId,
    type: '댓글' as const,
    title: '새로운 댓글',
    message: `${senderName}님이 회원님의 일기에 댓글을 남겼습니다.`,
    is_read: false,
  });

  if (error) {
    throw new Error('댓글 알림 생성 실패: ' + error.message);
  }
};
