import supabase from './supabase/client';
/**
 *  다이어리에 좋아요 시 알림
 */
export const postLikeNotification = async (
  recipientUserId: string,
  senderUserId: string,
  diaryId: string,
) => {
  const { data: senderUser } = await supabase
    .from('users')
    .select('name')
    .eq('id', senderUserId)
    .single();

  if (!senderUser) return;

  const { data } = await supabase
    .from('notifications')
    .select('id')
    .eq('diary_id', diaryId)
    .eq('type', '좋아요')
    .eq('sender_id', senderUserId)
    .maybeSingle();

  if (data) return;

  const { error } = await supabase.from('notifications').insert({
    user_id: recipientUserId,
    diary_id: diaryId,
    title: '좋아요 알림',
    message: `${senderUser.name}님이 좋아요를 눌렀습니다.`,
    type: '좋아요',
    is_read: false,
    sender_id: senderUserId,
  });

  if (error) {
    throw new Error('좋아요 알림 생성 실패');
  }
};

/**
 *  다이어리에 댓글 작성 시 알림
 */
export const postCommentNotification = async (
  recipientUserId: string,
  senderUserId: string,
  diaryId: string,
) => {
  const { data: senderUser } = await supabase
    .from('users')
    .select('name')
    .eq('id', senderUserId)
    .single();

  if (!senderUser) return;

  const { error } = await supabase.from('notifications').insert({
    user_id: recipientUserId,
    diary_id: diaryId,
    title: '댓글 알림',
    message: `${senderUser.name}님이 댓글을 남겼습니다.`,
    type: '댓글',
    is_read: false,
    sender_id: senderUserId,
  });

  if (error) {
    throw new Error('좋아요 알림 생성 실패');
  }
};
