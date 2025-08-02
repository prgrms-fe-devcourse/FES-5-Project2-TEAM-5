import { useState, type CSSProperties } from 'react';
import { FiBell } from 'react-icons/fi';
import NotificationItem from './components/NotificationItem';
import { useNotification } from './hook/useNotification';
import style from './style.module.css';

interface Props {
  color: CSSProperties['color'];
}

const Notification = ({ color }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { isLoading, notifications, onDelete, hasNewNotification, onReadAll } = useNotification();

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <section className={style.container}>
      <h2 className="sr-only">실시간 알림</h2>
      <button
        type="button"
        aria-label={`알림 ${hasNewNotification ? '(새 알림있음)' : ''}`}
        className={style.bellButton}
        data-tooltip={`알림 ${hasNewNotification ? '(새 알림있음)' : ''}`}
        onClick={handleClick}
      >
        {hasNewNotification && <div className={style.notificationBadge} aria-hidden="true" />}
        <FiBell size={24} aria-hidden="true" style={{ color }} />
      </button>

      {isOpen && (
        <div className={style.notificationWrapper}>
          {/* 알림 리스트 */}
          <ul className={style.notificationList}>
            {isLoading ? (
              <div className={style.spinnerWrapper}>
                <div className={style.spinner} />
              </div>
            ) : (
              <>
                {notifications.length > 0 ? (
                  <>
                    {notifications.map((notification) => (
                      <NotificationItem notification={notification} key={notification.id} />
                    ))}
                  </>
                ) : (
                  <li className={style.emptyNotification}>알림 없음</li>
                )}
              </>
            )}
          </ul>
          {/*  읽음, 삭제 버튼 */}
          <div className={style.buttonGroup}>
            <button
              type="button"
              className={style.notificationAllReadButton}
              onClick={onReadAll}
              disabled={!(notifications.length > 0)}
            >
              모두 읽음
            </button>
            <button
              type="button"
              className={style.notificationDeleteButton}
              onClick={onDelete}
              disabled={!(notifications.length > 0)}
            >
              알림 삭제
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
export default Notification;
