import { useId, useRef } from 'react';
import S from './style.module.css';
import supabase from '@/shared/supabase/supabase';
import { useUser } from '@/shared/hooks/useUser';
import { toastUtils } from '@/shared/utils/toastUtils';

const ChangeNickname = () => {
  const { userInfo } = useUser();
  const nicknameId = useId();
  const nicknameRef = useRef<HTMLInputElement | null>(null);

  const handleChangeNickname = async () => {
    if (nicknameRef.current && userInfo) {
      const value = nicknameRef.current.value;
      const { error } = await supabase.from('users').update({ name: value }).eq('id', userInfo.id);

      if (error) {
        toastUtils.error({ title: '실패', message: '닉네임 변경에 실패했습니다.' });
        return;
      } else {
        toastUtils.success({ title: '성공', message: '닉네임 변경 성공!' });
        nicknameRef.current.value = '';
      }
    }
  };

  return (
    <>
      <label className={S.inputLabel} htmlFor={nicknameId}>
        닉네임
      </label>
      <div className={S.inputSection}>
        <input
          ref={nicknameRef}
          className={S.nicknameInput}
          type="text"
          name="nickname"
          id={nicknameId}
          placeholder="닉네임 변경"
        />
        <button type="button" onPointerDown={handleChangeNickname}>
          변경
        </button>
      </div>
    </>
  );
};
export default ChangeNickname;
