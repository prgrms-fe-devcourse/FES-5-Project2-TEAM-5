import supabase from './supabase/client';
/**
 *  다이어리에 좋아요 시 알림
 */
export const postLikeNotification = async (
  recipientUserId: string,
  senderUserName: string,
  diaryId: string,
) => {
  const { error } = await supabase.from('notifications').insert({
    user_id: recipientUserId,
    diary_id: diaryId,
    title: '좋아요 알림',
    message: `${senderUserName}님이 좋아요를 눌렀습니다.`,
    type: '좋아요',
    is_read: false,
  });

  if (error) {
    console.error('알림 생성 에러:', error);
    throw new Error('좋아요 알림 생성 실패');
  }
};

/**
 *  다이어리에 댓글 작성 시 알림
 */
export const postCommentNotification = async (
  recipientUserId: string,
  senderUserName: string,
  diaryId: string,
) => {
  const { error } = await supabase.from('notifications').insert({
    user_id: recipientUserId,
    diary_id: diaryId,
    title: '댓글 알림',
    message: `${senderUserName}님이 댓글을 남겼습니다.`,
    type: '댓글',
    is_read: false,
  });

  if (error) {
    throw new Error('좋아요 알림 생성 실패');
  }
};
