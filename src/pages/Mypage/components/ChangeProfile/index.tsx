import style from './style.module.css';
import defaultProfile from '@/assets/defaultProfile.svg';
import { IoClose } from 'react-icons/io5';
import { HiArrowPath } from 'react-icons/hi2';
import { useEffect, useId, useRef, useState } from 'react';
import { useUploadImage } from '@/shared/hooks';
import { useUserContext } from '@/shared/context/UserContext';
import { useProfileChange } from '../../hooks/useProfileChange';
import { toastUtils } from '@/shared/components/Toast';

const ChangeProfile = () => {
  const { userInfo, updateUserInfo } = useUserContext();
  const profileId = useId();
  const profileRef = useRef<HTMLInputElement | null>(null);
  const [displayImage, setDisplayImage] = useState<string>(defaultProfile);
  const { imageFile, imagePreview, onChange, clearImage } = useUploadImage();
  const { updateProfile } = useProfileChange();

  useEffect(() => {
    if (imagePreview) {
      setDisplayImage(imagePreview);
    } else if (userInfo?.profile_image) {
      setDisplayImage(userInfo?.profile_image);
    }
  }, [imagePreview]);

  // 설정된 이미지 리셋
  const resetInputAndImage = () => {
    clearImage();
    if (profileRef.current) {
      profileRef.current.value = '';
    }
  };

  const handleProfileClick = () => {
    if (profileRef.current) {
      profileRef.current.click();
    }
  };

  const handleProfileKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleProfileClick();
  };

  // 프로필 변경
  const handleChangeProfile = async () => {
    try {
      if (!userInfo) return;

      // 프로플 업데이트
      const updated = await updateProfile(imageFile, userInfo);
      // 성공 처리
      resetInputAndImage(); // 클린
      updateUserInfo(updated); // 세션 업데이트
      toastUtils.success({ title: '성공', message: '프로필 이미지 변경 성공!' });
      // 에러 처리
    } catch (error) {
      if (error instanceof Error) {
        toastUtils.error({ title: '실패', message: error.message });
      } else {
        toastUtils.error({ title: '실패', message: '예상하지 못한 에러 발생' });
      }
    }
  };

  // 기본 프로플로 변경
  const setDefaultProfile = async () => {
    if (!userInfo) return;
    try {
      setDisplayImage(defaultProfile);
      // 기본 프로필로 업데이트
      const updated = await updateProfile(null, userInfo);
      resetInputAndImage();
      updateUserInfo(updated); // 세션 업데이트
      // 성공 처리
      toastUtils.info({ title: '변경', message: '기본 프로필 이미지로 변경' });
      // 에러 처리
    } catch (error) {
      if (error instanceof Error) {
        toastUtils.error({ title: '실패', message: error.message });
      } else {
        toastUtils.error({ title: '실패', message: '예상하지 못한 에러 발생' });
      }
    }
  };

  // 이전 프로필 되돌리기
  const revertProfile = () => {
    if (userInfo?.profile_image) {
      resetInputAndImage();
      setDisplayImage(userInfo.profile_image);
    }
  };

  return (
    <div className={style.profileSection}>
      <IoClose className={style.closeButton} size={24} onPointerDown={setDefaultProfile} />
      <label
        className={style.profileImage}
        role="button"
        tabIndex={0}
        id={profileId}
        onClick={handleProfileClick}
        onKeyDown={handleProfileKeyDown}
        aria-label="프로필 선택"
      >
        <img src={displayImage} alt="프로필" loading="lazy" />
      </label>
      <input
        ref={profileRef}
        type="file"
        name="profile"
        id={profileId}
        onChange={onChange}
        hidden
      />
      <div className={style.buttonGroup}>
        <button
          type="button"
          className={style.profileButton}
          onClick={handleChangeProfile}
          disabled={!imagePreview}
          aria-label="프로필 변경"
        >
          프로필 변경
        </button>
        <button
          className={style.revertBUtton}
          type="button"
          onPointerDown={revertProfile}
          aria-label="기존 프로필로 변경"
        >
          <HiArrowPath size={24} />
        </button>
      </div>
    </div>
  );
};
export default ChangeProfile;
