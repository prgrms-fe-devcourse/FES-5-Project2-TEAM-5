import logo from '@/assets/logo.svg';
import { useForm } from '@/shared/hooks';
import { toastUtils } from '@/shared/utils/toastUtils';
import { useEffect, useId } from 'react';
import { FaGithub } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthInput, AuthLayout } from '../components';
import S from './style.module.css';
import { login } from './utils/helper';
import type { LoginForm } from './utils/type';
import { useRememberMe } from './hook/useRememberMe';

const Login = () => {
  const location = useLocation();
  const rememberId = useId();
  const emailId = useId();
  const pwdId = useId();
  const navigate = useNavigate();

  const { checked, handleRememberMe, storedValue, toggleChecked } = useRememberMe();

  const userEmail = (location.state?.email as string) ?? storedValue;
  const { formData, onChange, setFormData } = useForm<LoginForm>({
    initialData: { email: userEmail, password: '' },
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, email: userEmail }));
  }, [userEmail, setFormData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { email, password } = formData;
      await login({ email, password });

      toastUtils.success({ title: '로그인 성공', message: '로그인에 성공했습니다!' });

      handleRememberMe(email);

      navigate('/home');
    } catch (error) {
      console.error(`로그인 실패 : ${error}`);
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
          <button type="button" className={S.githubButton}>
            <FaGithub size={20} aria-hidden="true" />
            Continue with GitHub
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};
export default Login;
