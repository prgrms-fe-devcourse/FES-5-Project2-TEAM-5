import {
  getNotificationList,
  updateNotificationAllRead,
  updateNotificationDelete,
} from '@/shared/api/notification';
import supabase from '@/shared/api/supabase/client';
import type { Tables } from '@/shared/api/supabase/types';
import { useUserContext } from '@/shared/context/UserContext';
import { useEffect, useState, useTransition } from 'react';

export const useNotification = () => {
  const { userInfo } = useUserContext();
  const [notifications, setNotifications] = useState<Tables<'notifications'>[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!userInfo) return;

    startTransition(async () => {
      const data = await getNotificationList(userInfo.id);
      setNotifications(data ?? []);
    });
  }, [userInfo?.id]);

  useEffect(() => {
    if (!userInfo?.id) return;
    const subscription = supabase
      .channel(`notification_${userInfo.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          const notification = payload.new as Tables<'notifications'>;
          setNotifications((prev) => [notification, ...prev]);
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'notifications' },
        (payload) => {
          const updated = payload.new as Tables<'notifications'>;
          setNotifications((prev) => {
            // 알림 전부 삭제
            if (updated.is_deleted === true) {
              return prev.filter((notif) => notif.id !== updated.id);
            }

            // 기타 업데이트
            return prev.map((notif) => (notif.id === updated.id ? updated : notif));
          });
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userInfo?.id]);

  const handleDeleteNotification = async () => {
    if (!userInfo?.id || notifications.length === 0) return;
    await updateNotificationDelete(userInfo?.id);
    setNotifications([]);
  };

  const onAllRead = async () => {
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
    onAllRead,
  };
};
