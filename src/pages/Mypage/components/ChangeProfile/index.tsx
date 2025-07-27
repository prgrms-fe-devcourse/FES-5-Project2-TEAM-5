import S from './style.module.css';
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
  const { updateProfileImage } = useProfileChange();

  useEffect(() => {
    if (imagePreview) {
      setDisplayImage(imagePreview);
    } else if (userInfo?.profile_image) {
      setDisplayImage(userInfo?.profile_image);
    }
  }, [imagePreview]);

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

  const handleChangeProfile = async () => {
    try {
      if (userInfo) {
        const updated = await updateProfileImage(imageFile, userInfo);
        resetInputAndImage();
        updateUserInfo(updated);
        toastUtils.success({ title: '성공', message: '프로필 이미지 변경 성공!' });
      }
    } catch (error) {
      toastUtils.error({ title: '실패', message: '프로필 이미지 변경 실패..' });
    }
  };

  const setDefaultProfile = async () => {
    try {
      if (userInfo) {
        setDisplayImage(defaultProfile);
        const updated = await updateProfileImage(null, userInfo);
        resetInputAndImage();
        updateUserInfo(updated);
        toastUtils.info({ title: '변경', message: '기본 프로필 이미지로 변경' });
      }
    } catch (error) {
      toastUtils.error({ title: '실패', message: '본 프로필 이미지로 변경 실패..' });
    }
  };

  const revertProfile = () => {
    if (userInfo?.profile_image) {
      resetInputAndImage();
      setDisplayImage(userInfo.profile_image);
    }
  };

  return (
    <div className={S.profileSection}>
      <IoClose className={S.closeButton} size={24} onPointerDown={setDefaultProfile} />
      <label
        className={S.profileImage}
        role="button"
        tabIndex={0}
        id={profileId}
        onPointerDown={handleProfileClick}
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
      <div className={S.buttonGroup}>
        <button
          type="button"
          className={S.profileButton}
          onClick={handleChangeProfile}
          disabled={!imagePreview}
          aria-label="프로필 변경"
        >
          프로필 변경
        </button>
        <button
          className={S.revertBUtton}
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
