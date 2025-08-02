import logo from '@/assets/logo.svg';
import { useForm } from '@/shared/hooks';
import { toastUtils } from '@/shared/components/Toast';
import { useEffect, useId } from 'react';
import { FaGithub } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthInput, AuthLayout } from '../components';
import S from './style.module.css';
import type { LoginForm } from './utils/type';
import { useRememberMe } from './hook/useRememberMe';
import { loginWithEmail, loginWithGithub } from '@/shared/api/auth';

const Login = () => {
  const rememberId = useId(); // 아이디 기억하기
  const emailId = useId();
  const pwdId = useId();
  const location = useLocation();
  const message = location.state?.message;
  const navigate = useNavigate();

  const { checked, handleRememberMe, storedValue, toggleChecked } = useRememberMe();

  // 회원가입 or remember me 이메일 적용
  const userEmail = (location.state?.email as string) ?? storedValue;
  const { formData, onChange, setFormData } = useForm<LoginForm>({
    initialData: { email: userEmail, password: '' },
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, email: userEmail }));
  }, [userEmail, setFormData]);

  // 인증이 필요한 경우
  useEffect(() => {
    if (message) {
      toastUtils.info({ title: '인증 필요', message: message });
      navigate(location.pathname, { replace: true });
    }
  }, [message]);

  // 이메일 로그인
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { email, password } = formData;
      await loginWithEmail({ email, password });

      toastUtils.success({ title: '로그인 성공', message: '로그인에 성공했습니다!' });

      handleRememberMe(email);

      navigate('/');
    } catch (error) {
      if (error instanceof Error)
        toastUtils.error({ title: '로그인 실패', message: error.message });
      setFormData((prev) => ({ ...prev, password: '' })); // 비밀번호 초기화
    }
  };

  // 깃허브 로그인
  const handleLoginWithGithub = async (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await loginWithGithub();
    } catch (error) {
      if (error instanceof Error) {
        toastUtils.error({ title: '인증 실패', message: '깃허브 로그인에 실패했습니다.' });
      }
    }
  };

  return (
    <AuthLayout>
      <h1 className={S.logo}>
        <img src={logo} alt="" /> <span>Seediary</span>
      </h1>
      <form className={S.form} onSubmit={handleSubmit}>
        <div className={S.inputGroup}>
          <AuthInput
            id={emailId}
            label="Email"
            placeholder="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
          />
          <AuthInput
            id={pwdId}
            label="Password"
            placeholder="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={onChange}
          />
        </div>
        <div className={S.formOptions}>
          <label htmlFor={rememberId}>
            <input
              className={S.checkboxInput}
              type="checkbox"
              name="remember"
              id={rememberId}
              checked={checked}
              onChange={toggleChecked}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  toggleChecked();
                }
              }}
              aria-label="아이디 기억하기"
            />
            remember me
          </label>
          <Link to="/register">register</Link>
        </div>

        <div className={S.buttonGroup}>
          <button type="submit" className={S.loginButton}>
            Login
          </button>
          <button type="button" className={S.githubButton} onPointerDown={handleLoginWithGithub}>
            <FaGithub size={20} aria-hidden="true" />
            Continue with GitHub
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};
export default Login;
