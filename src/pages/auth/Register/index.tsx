import { useForm, useUploadImage } from '@/shared/hooks';
import { toastUtils } from '@/shared/utils/toastUtils';
import { useId, useRef } from 'react';
import { IoChevronBackOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import defaultProfile from '../assets/profile.svg';
import { AuthInput, AuthLayout } from '../components';
import S from './style.module.css';
import { createAuthAccount, insertUser, uploadAndGetPublicUrl } from './utils/helper';
import type { RegisterForm } from './utils/type';
import { registerValidator } from './utils/validator';

const Register = () => {
  const profileId = useId();
  const emailId = useId();
  const nicknameId = useId();
  const pwdId = useId();
  const confirmPwdId = useId();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { error, formData, onChange, validateAll } = useForm<RegisterForm>({
    initialData: {
      email: '',
      confirmPassword: '',
      name: '',
      password: '',
    },
    validator: registerValidator,
  });

  const { imageFile, imagePreview, onChange: onChangePreview } = useUploadImage();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateAll()) return false;
    try {
      const { email, name, password } = formData;
      const userId = await createAuthAccount({ email, password });
      const publicUrl = imageFile ? await uploadAndGetPublicUrl({ file: imageFile, userId }) : null;
      await insertUser({ id: userId, name, profile_image: publicUrl });
      toastUtils.success({ title: '화원가입 성공', message: 'Seediary에 오신 걸 환영합니다!' });

      navigate('/login', {
        state: {
          email,
        },
      });
    } catch (error) {
      console.error(`회원가입 실패 : ${error}`);
    }
  };

  const handleSelectProfile = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const handleBack = () => {
    navigate('/login');
  };

  return (
    <AuthLayout>
      <IoChevronBackOutline
        role="button"
        tabIndex={1}
        className={S.backButton}
        onClick={handleBack}
        aria-label="로그인 페이지로 가기"
      />
      <label
        htmlFor={profileId}
        className={S.profile}
        onKeyDown={handleSelectProfile}
        tabIndex={0}
        role="button"
        aria-label="프로필 이미지 선택"
      >
        <div className={S.defaultImage}>
          {imagePreview ? (
            <img src={imagePreview} alt="프로필 미리보기" className={S.previewImage} />
          ) : (
            <img src={defaultProfile} />
          )}
        </div>
        <span>프로필 이미지</span>
      </label>
      <input
        ref={fileInputRef}
        type="file"
        name="profile"
        id={profileId}
        accept="image/*"
        onChange={onChangePreview}
        hidden
      />
      <form className={S.form} onSubmit={handleSubmit}>
        <AuthInput
          id={emailId}
          label="이메일"
          name="email"
          type="email"
          placeholder="이메일"
          onChange={onChange}
        />
        <AuthInput
          id={nicknameId}
          label="닉네임"
          name="name"
          type="text"
          placeholder="닉네임"
          onChange={onChange}
        />
        <AuthInput
          id={pwdId}
          label="비밀번호"
          name="password"
          type="password"
          placeholder="비밀번호"
          onChange={onChange}
        />
        <AuthInput
          id={confirmPwdId}
          label="비밀번호 확인"
          name="confirmPassword"
          type="password"
          placeholder="비밀번호 확인"
          onChange={onChange}
        />
        <div className={S.errorMessage}>{error && <span>{error}</span>}</div>
        <button type="submit" className={S.registerButton}>
          signup
        </button>
      </form>
    </AuthLayout>
  );
};
export default Register;
