import { toastUtils } from '@/shared/components/Toast';
import { useId, useState } from 'react';
import S from './style.module.css';
import { useUserContext } from '@/shared/context/UserContext';
import { nameValidator } from '@/shared/utils/validator';
import { uploadUserNickname } from '@/shared/api/user';
import ConfirmModal from '@/shared/components/Modal/ConfirmModal';

const ChangeNickname = () => {
  const nicknameId = useId();
  const [nickname, setNickname] = useState<string>('');
  const { userInfo, updateUserInfo } = useUserContext();
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState(false); // 모달 컨트롤

  const isFormValid = nickname && !error;

  // 모달 오픈
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // 인풋 change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setNickname(value);

    const errorMessage = nameValidator(value);
    setError(errorMessage || '');
  };

  // 닉네임 변경
  const handleConfirmNicknameChange = async () => {
    if (!userInfo) return;
    try {
      // 닉네임 validation
      const errorMessage = nameValidator(nickname);
      if (errorMessage) {
        setError(errorMessage);
        return;
      }

      // 닉네임 변경
      const user = await uploadUserNickname({ id: userInfo.id, nickname });
      // 성공 로직
      toastUtils.success({ title: '성공', message: '닉네임 변경 성공!' });
      updateUserInfo(user); // 세션 업데이트
      setNickname('');
      // 에러 처리
    } catch (error) {
      if (error instanceof Error) {
        toastUtils.error({ title: '실패', message: error.message });
      } else {
        toastUtils.error({ title: '실패', message: '예상하지 못한 에러 발생' });
      }
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
          onChange={handleInputChange}
        />
        <button
          type="button"
          onClick={handleOpenModal}
          disabled={!isFormValid}
          aria-label="닉네임 변경"
        >
          변경
        </button>
      </div>
      <div className={S.errorMessage}>{error && <span>{error}</span>}</div>

      {showModal && (
        <ConfirmModal
          title="닉네임 변경"
          message="닉네임을 변경하시겠습니까?"
          onConfirm={() => {
            handleConfirmNicknameChange();
            setShowModal(false);
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
export default ChangeNickname;
