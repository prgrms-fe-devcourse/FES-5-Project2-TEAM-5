import type { Tables } from '@/shared/api/supabase/types';
import style from './style.module.css';
import { FcLike, FcComments } from 'react-icons/fc';
import { updateNotificationRead } from '@/shared/api/notification';
import { useUserContext } from '@/shared/context/UserContext';
import { useNavigate } from 'react-router-dom';

interface Props {
  notification: Tables<'notifications'>;
}

const NotificationItem = ({ notification }: Props) => {
  const { userInfo } = useUserContext();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!userInfo) return;
    void updateNotificationRead(userInfo.id, notification.id);
    navigate(`/diary/${notification.diary_id}`);
  };

  return (
    <li className={style.notificationItem} onClick={handleClick}>
      <div className={style.icon}>
        {notification.type === '댓글' && <FcComments size={25} />}
        {notification.type === '좋아요' && <FcLike size={25} />}
      </div>
      <div className={style.notificationContents}>
        {!notification.is_read && <div className={style.notificationBadge} aria-hidden="true" />}
        <span className={style.notificationTitle}> {notification.title}</span>
        <span className={style.notificationMessage}>{notification.message}</span>
      </div>
    </li>
  );
};
export default NotificationItem;
