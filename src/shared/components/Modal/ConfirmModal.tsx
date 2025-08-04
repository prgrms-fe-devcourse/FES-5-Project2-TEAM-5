import { useEffect, useRef } from 'react';
import ModalPortal from './ModalPortal';
import S from './style.module.css'


interface Props {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

function ConfirmModal({ title, message, onConfirm, onCancel, confirmText = '확인', cancelText = '취소' }:Props) {
  
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.setProperty('overflow', 'hidden', 'important'); // 배경 스크롤 방지

    modalRef.current?.focus(); // 모달 열릴 때 div에 포커스

    const handleKeyDown = (e: KeyboardEvent) => { // ESC, Enter 이벤트 핸들러
      if (e.key === 'Escape') {
        onCancel();
      } else if (e.key === 'Enter') {
        onConfirm();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.documentElement.style.setProperty('overflow', 'auto', 'important'); // 배경 스크롤 복구
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  return (
    <ModalPortal>
      <div className={S.overlay} onClick={onCancel}>
        <div
          className={S.modal}
          ref={modalRef}
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className={S.title}>{title}</h2>
          <p className={S.message}>{message}</p>
          <div className={S.buttons}>
            <button type="button" className={`${S.button} ${S.cancel}`} onClick={onCancel}>{cancelText}</button>
            <button type="button" className={`${S.button} ${S.confirm}`} onClick={onConfirm}>{confirmText}</button>
          </div>
        </div>
      </div>
    </ModalPortal>
  )
}
export default ConfirmModal