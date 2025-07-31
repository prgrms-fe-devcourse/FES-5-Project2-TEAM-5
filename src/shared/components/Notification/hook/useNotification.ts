import {
  createNotificationChannel,
  getNotificationList,
  updateNotificationAllRead,
  updateNotificationDelete,
} from '@/shared/api/notification';
import type { Tables } from '@/shared/api/supabase/types';
import { useUserContext } from '@/shared/context/UserContext';
import type {
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
} from '@supabase/supabase-js';
import { useEffect, useState, useTransition } from 'react';

export const useNotification = () => {
  const { userInfo } = useUserContext();
  const [notifications, setNotifications] = useState<Tables<'notifications'>[]>([]);
  const [isPending, startTransition] = useTransition();

  // 알림 목록 전체 불러오기
  useEffect(() => {
    if (!userInfo) return;

    startTransition(async () => {
      const data = await getNotificationList(userInfo.id);
      setNotifications(data ?? []);
    });
  }, [userInfo?.id]);

  // 알림 구독 채널 생성
  useEffect(() => {
    if (!userInfo?.id) return;
    const subscription = createNotificationChannel(
      userInfo.id,
      handleNewNotification,
      handleUpdateState,
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [userInfo?.id]);

  // 알림 구독 새 알림 감지
  const handleNewNotification = (
    payload: RealtimePostgresInsertPayload<Tables<'notifications'>>,
  ) => {
    const notification = payload.new as Tables<'notifications'>;
    setNotifications((prev) => [notification, ...prev]);
  };

  // 알림 구독 상태 변경 감지
  const handleUpdateState = (payload: RealtimePostgresUpdatePayload<Tables<'notifications'>>) => {
    const updated = payload.new as Tables<'notifications'>;
    setNotifications((prev) => {
      // 알림 전부 삭제
      if (updated.is_deleted === true) {
        return prev.filter((notif) => notif.id !== updated.id);
      }

      // 기타 업데이트
      return prev.map((notif) => (notif.id === updated.id ? updated : notif));
    });
  };

  // 알림 모두 삭제 버튼
  const handleDeleteNotification = async () => {
    if (!userInfo?.id || notifications.length === 0) return;
    await updateNotificationDelete(userInfo?.id);
    setNotifications([]);
  };

  // 알림 모드 읽기 버튼
  const handleReadAllNotification = async () => {
    if (!userInfo?.id || notifications.length === 0) return;
    await updateNotificationAllRead(userInfo?.id);
    setNotifications((prev) => prev.map((notif) => ({ ...notif, is_read: true })));
  };

  const hasNewNotification = notifications.some((notification) => !notification.is_read);

  return {
    notifications,
    isLoading: isPending,
    onDelete: handleDeleteNotification,
    hasNewNotification,
    onReadAll: handleReadAllNotification,
  };
};
