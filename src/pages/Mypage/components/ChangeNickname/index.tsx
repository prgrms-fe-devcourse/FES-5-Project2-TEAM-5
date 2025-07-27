import { toastUtils } from '@/shared/components/Toast';
import { useId, useState } from 'react';
import S from './style.module.css';
import { useUserContext } from '@/shared/context/UserContext';
import supabase from '@/shared/api/supabase/client';
import { nameValidator } from '@/shared/utils/validator';

const ChangeNickname = () => {
  const nicknameId = useId();
  const [nickname, setNickname] = useState<string>('');
  const { userInfo, updateUserInfo } = useUserContext();
  const [error, setError] = useState<string>('');

  const isFormValid = nickname && !error;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setNickname(value);

    const errorMessage = nameValidator(value);
    setError(errorMessage || '');
  };

  const handleChangeNickname = async () => {
    if (userInfo) {
      const { data, error } = await supabase
        .from('users')
        .update({ name: nickname })
        .eq('id', userInfo.id)
        .select()
        .single();

      if (error) {
        toastUtils.error({ title: '실패', message: '닉네임 변경에 실패했습니다.' });
        return;
      }
      toastUtils.success({ title: '성공', message: '닉네임 변경 성공!' });
      updateUserInfo(data);

      setNickname('');
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      // 엔터나 스페이스바
      e.preventDefault();
      handleChangeNickname();
    }
  };

  return (
    <div>
      <label className={S.inputLabel} htmlFor={nicknameId}>
        닉네임
      </label>
      <div className={S.inputSection}>
        <input
          className={S.nicknameInput}
          type="text"
          name="nickname"
          id={nicknameId}
          value={nickname}
          placeholder="닉네임을 변경해주세요."
          onChange={handleChange}
        />
        <button
          type="button"
          onPointerDown={handleChangeNickname}
          onKeyDown={handleKeyDown}
          disabled={!isFormValid}
          aria-label="닉네임 변경"
        >
          변경
        </button>
      </div>
      <div className={S.errorMessage}>{error && <span>{error}</span>}</div>
    </div>
  );
};
export default ChangeNickname;
