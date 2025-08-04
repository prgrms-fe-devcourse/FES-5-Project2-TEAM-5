import { useId, useRef, useState } from 'react';
import S from './style.module.css';
import { useForm } from '@/shared/hooks';
import type { ChangePasswordForm } from '../../utils/type';
import { toastUtils } from '@/shared/components/Toast';
import { useUserContext } from '@/shared/context/UserContext';
import { validator } from '../../utils/validator';
import { reauthenticate, updateUserPassword } from '@/shared/api/auth';
import ConfirmModal from '@/shared/components/Modal/ConfirmModal';

const ChangePassword = () => {
  const { userInfo, user } = useUserContext();
  const currentPwdId = useId();
  const newPwdId = useId();
  const confirmNewPwdId = useId();
  const [showModal, setShowModal] = useState(false); // 모달 컨트롤

  // 깃허브 계정 비밀번호 변경 렌더링 안함
  if (user?.app_metadata.provider === 'github') return null;

  // 현재 비밀번호
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  // 새 비밀번호
  const { formData, onChange, error, setFormData } = useForm<ChangePasswordForm>({
    initialData: { confirmPassword: '', password: '' },
    validator,
  });

  // 새 비밀번호 validation
  const isFormValid = formData.password && formData.confirmPassword && !error;

  // 서밋 이벤트
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowModal(true);
  };
  // 비밀번호 변경
  const handlePasswordChange = async () => {
    if (!userInfo || !currentPasswordRef.current) {
      toastUtils.error({ title: '실패', message: '사용자 정보를 확인할 수 없습니다.' });
      return;
    }
    // 현재 비밀번호
    const currentPassword = currentPasswordRef.current.value;

    // 현재 비밀번호 입력 확인
    if (!currentPassword) {
      toastUtils.error({ title: '실패', message: '현재 비밀번호를 입력해주세요.' });
      return;
    }

    // 현재 비밀번호와 새 비밀번호 같은지 확인
    if (currentPassword === formData.password) {
      toastUtils.error({
        title: '실패',
        message: '현재 비밀번호와 다른 비밀번호를 입력해주세요.',
      });
      return;
    }

    try {
      // 현재 비밀번호 재인증
      await reauthenticate({ email: userInfo.email, password: currentPassword });
      // 비밀번호 변경
      await updateUserPassword(formData.password);

      // 성공 처리
      toastUtils.success({ title: '성공', message: '비밀번호가 성공적으로 변경되었습니다!' });
      currentPasswordRef.current.value = '';
      setFormData({ confirmPassword: '', password: '' });
    } catch (error) {
      if (error instanceof Error) {
        toastUtils.error({ title: '실패', message: error.message });
      } else {
        toastUtils.error({ title: '실패', message: '예기치 못한 오류가 발생했습니다.' });
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label className={S.inputLabel} htmlFor={currentPwdId}>
          현재 비밀번호
        </label>
        <div className={S.inputSection}>
          <input
            ref={currentPasswordRef}
            className={S.passwordInput}
            type="password"
            name="password"
            id={currentPwdId}
            placeholder="현재 비밀번호"
          />
        </div>
        <label className={S.inputLabel} htmlFor={newPwdId}>
          새 비밀번호
        </label>
        <div className={S.inputSection}>
          <input
            className={S.passwordInput}
            type="password"
            name="password"
            id={newPwdId}
            value={formData.password}
            placeholder="새 비밀번호"
            onChange={onChange}
          />
        </div>
        <label className={S.inputLabel} htmlFor={confirmNewPwdId}>
          새 비밀번호 확인
        </label>
        <div className={S.inputSection}>
          <input
            className={S.passwordInput}
            type="password"
            name="confirmPassword"
            id={confirmNewPwdId}
            value={formData.confirmPassword}
            placeholder="새 비밀번호 확인"
            onChange={onChange}
          />
          <button type="submit" disabled={!isFormValid}>
            변경
          </button>
        </div>
      </form>
      <div className={S.errorMessage}>{error && <span>{error}</span>}</div>
      {showModal && (
        <ConfirmModal
          title="비밀번호 변경"
          message="비밀번호를 변경하시겠습니까?"
          onConfirm={() => {
            handlePasswordChange();
            setShowModal(false);
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
};
export default ChangePassword;
