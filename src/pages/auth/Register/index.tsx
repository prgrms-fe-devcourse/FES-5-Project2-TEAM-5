import { useId, useState } from 'react';
import S from './style.module.css';
import { AuthInput, AuthLayout, FlowerProfile } from '../components';
import { useForm } from './hook';
import supabase from '@/shared/supabase/supabase';

const Register = () => {
  const profileId = useId();
  const emailId = useId();
  const nicknameId = useId();
  const pwdId = useId();
  const confirmPwdID = useId();

  const { error, formData, onChange, validateAll } = useForm({
    email: '',
    confirmPassword: '',
    name: '',
    password: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateAll()) return false;
    const { data: authData, error: signupError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });
    if (signupError || !authData.user) {
      alert('회원가입 실패');
      return;
    }

    const userId = authData.user.id;

    if (imageFile) {
      const fileExt = imageFile?.name.split('.').pop();
      const filePath = `${userId}.${fileExt}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from('profile')
        .upload(filePath, imageFile!, { cacheControl: '3600', upsert: true });

      if (storageError) return alert('이미지 저장 실패');

      console.log('storageData', storageData);
      console.log('storageError', storageError);
    }
  };

  return (
    <AuthLayout>
      <label htmlFor={profileId} className={S.profile}>
        <div className={S.defaultImage}>
          {imagePreview ? (
            <img src={imagePreview} alt="프로필 미리보기" className={S.previewImage} />
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
      <form className={S.form}>
        <AuthInput id={emailId} label="이메일" name="email" type="email" placeholder="이메일" />
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
          id={confirmPwdID}
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
