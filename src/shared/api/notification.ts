import supabase from './supabase/client';
/**
 *  다이어리에 좋아요 시 알림
 */
export const postLikeNotification = async (
  recipientUserId: string,
  senderUserId: string,
  diaryId: string,
  senderUserName: string,
) => {
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
    message: `${senderUserName}님이 좋아요를 눌렀습니다.`,
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
  senderUserName: string,
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
    message: `${senderUserName}님이 댓글을 남겼습니다.`,
    type: '댓글',
    is_read: false,
    sender_id: senderUserId,
  });

  if (error) {
    throw new Error('좋아요 알림 생성 실패');
  }
};

/**
 * 알림 목록 조회
 */
export const getNotificationList = async (userId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('is_deleted', false);

  if (error) {
    console.error('알림 목록 조회 실패');
  }

  return data;
};

/**
 * 알림 삭제
 */
export const updateNotificationDelete = async (userId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_deleted: true })
    .eq('user_id', userId);

  if (error) {
    throw new Error('메시지 삭제 에러');
  }
};

/**
 * 알림 모두 읽음
 */
export const updateNotificationAllRead = async (userId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId);

  if (error) {
    throw new Error('메시지 모두 읽음 에러');
  }
};

/**
 * 단일 읽음 처리
 */
export const updateNotificationRead = async (userId: string, notifId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('id', notifId);

  if (error) {
    throw new Error('메시지 읽음 에러');
  }
};
