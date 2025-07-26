import S from './style.module.css';
import defaultProfile from '@/assets/defaultProfile.svg';
import { IoClose } from 'react-icons/io5';
import { HiArrowPath } from 'react-icons/hi2';
import { useEffect, useId, useRef, useState } from 'react';
import { useUploadImage } from '@/shared/hooks';
import { useProfileChange } from '../ChangeUserInfo/hooks/useProfileChange';
import { useUser } from '@/shared/hooks/useUser';

const ChangeProfile = () => {
  const { userInfo } = useUser();
  const profileId = useId();
  const profileRef = useRef<HTMLInputElement | null>(null);
  const [displayImage, setDisplayImage] = useState<string>(defaultProfile);
  const { imageFile, imagePreview, onChange, clearImage } = useUploadImage();
  const { updateProfileImage } = useProfileChange();

  useEffect(() => {
    if (userInfo?.profile_image) {
      setDisplayImage(userInfo.profile_image);
    }
  }, [userInfo?.profile_image]);

  const handleChangeProfile = async (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (imageFile) {
      await updateProfileImage(imageFile);
    }
  };

  const handleProfileClick = (e: React.PointerEvent<HTMLLabelElement>) => {
    e.preventDefault();
    profileRef?.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      profileRef?.current?.click();
    }
  };

  const setDefaultProfile = () => {
    clearImage();
    setDisplayImage(defaultProfile);
  };

  const resetProfile = () => {
    clearImage();
    if (userInfo?.profile_image) {
      setDisplayImage(userInfo.profile_image);
    } else {
      setDisplayImage(defaultProfile);
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
        onKeyDown={handleKeyDown}
      >
        <img src={imagePreview || displayImage} alt="프로필" loading="lazy" />
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
        >
          프로필 변경
        </button>
        <button className={S.revertBUtton} onPointerDown={resetProfile}>
          <HiArrowPath size={24} />
        </button>
      </div>
    </div>
  );
};
export default ChangeProfile;
