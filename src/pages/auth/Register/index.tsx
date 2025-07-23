import { useId, useState } from 'react';
import S from './style.module.css';
import { AuthInput, AuthLayout, FlowerProfile } from '../components';
import { toastUtils } from '@/shared/utils/toastUtils';

const Register = () => {
  const profileId = useId();
  const emailId = useId();
  const nicknameId = useId();
  const pwdId = useId();
  const confirmPwdID = useId();

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (profileImage) {
        URL.revokeObjectURL(profileImage);
      }

      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toastUtils.success({ message: '하이', title: 'hello' });
    // toastUtils.error({ message: '하이', title: 'hello' });
    // toastUtils.info({ message: '하이', title: 'hello' });
  };

  return (
    <AuthLayout>
      <label htmlFor={profileId} className={S.profile}>
        <div className={S.defaultImage}>
          {profileImage ? (
            <img src={profileImage} alt="프로필 미리보기" className={S.previewImage} />
          ) : (
            <FlowerProfile />
          )}
        </div>
        <span>프로필 이미지</span>
      </label>
      <input
        type="file"
        name="profile"
        id={profileId}
        accept="image/*"
        onChange={handleProfileImageChange}
        hidden
      />
      <form className={S.form} onSubmit={handleClick}>
        <AuthInput id={emailId} label="이메일" name="email" type="email" placeholder="이메일" />
        <AuthInput
          id={nicknameId}
          label="닉네임"
          name="nickname"
          type="text"
          placeholder="닉네임"
        />
        <AuthInput
          id={pwdId}
          label="비밀번호"
          name="password"
          type="password"
          placeholder="비밀번호"
        />
        <AuthInput
          id={confirmPwdID}
          label="비밀번호 확인"
          name="confirmPassword"
          type="password"
          placeholder="비밀번호 확인"
        />
        <span className={S.errorMessage}>에러 표시 할 곳</span>
        <button type="submit" className={S.registerButton}>
          signup
        </button>
      </form>
    </AuthLayout>
  );
};
export default Register;
