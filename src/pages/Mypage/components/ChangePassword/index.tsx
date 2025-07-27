import { useId, useRef } from 'react';
import S from './style.module.css';
import { useForm } from '@/shared/hooks';
import type { ChangePasswordForm } from '../../utils/type';
import { toastUtils } from '@/shared/components/Toast';
import { useUserContext } from '@/shared/context/UserContext';
import supabase from '@/shared/api/supabase/client';
import { validator } from '../../utils/validator';

const ChangePassword = () => {
  const { userInfo } = useUserContext();
  const currentPwdId = useId();
  const newPwdId = useId();
  const confirmNewPwdId = useId();

  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const { formData, onChange, error, setFormData } = useForm<ChangePasswordForm>({
    initialData: { confirmPassword: '', password: '' },
    validator,
  });

  const isFormValid = formData.password && formData.confirmPassword && !error;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInfo || !currentPasswordRef.current) {
      toastUtils.error({ title: '실패', message: '사용자 정보를 확인할 수 없습니다.' });
      return;
    }
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

      console.log(userInfo.email, currentPassword);
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: userInfo.email,
        password: currentPassword,
      });
      console.log(data);
      if (authError) {
        const errorMessage =
          authError.message === 'Invalid login credentials'
            ? '현재 비밀번호가 올바르지 않습니다.'
            : '인증에 실패했습니다.';
        toastUtils.error({ title: '실패', message: errorMessage });
        return;
      }

      // 비밀번호 변경
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (updateError) {
        toastUtils.error({ title: '실패', message: '비밀번호 변경에 실패했습니다.' });
        return;
      }

      // 성공 처리
      toastUtils.success({ title: '성공', message: '비밀번호가 성공적으로 변경되었습니다!' });
      currentPasswordRef.current.value = '';
      setFormData({ confirmPassword: '', password: '' });
    } catch (error) {
      console.error('비밀번호 변경 오류:', error);
      toastUtils.error({ title: '실패', message: '예기치 못한 오류가 발생했습니다.' });
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
    </>
  );
};
export default ChangePassword;
