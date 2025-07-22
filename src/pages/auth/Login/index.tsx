import { useId } from 'react';
import { FaGithub } from 'react-icons/fa';
import logo from '@/assets/logo.png';
import S from './style.module.css';
import AuthLayout from '../components/AuthLayout';

const Login = () => {
  const rememberId = useId();
  const emailId = useId();
  const pwdId = useId();

  return (
    <AuthLayout>
      <h1 className={S.logo}>
        <img src={logo} alt="" /> <span>Seediary</span>
      </h1>
      <form className={S.form}>
        <div className={S.inputGroup}>
          <label htmlFor={emailId} className="sr-only">
            Email
          </label>
          <input type="email" name="email" id={emailId} placeholder="Email" required />
          <label htmlFor={pwdId} className="sr-only">
            Password
          </label>
          <input type="password" name="password" id={pwdId} placeholder="Password" required />
        </div>
        <div className={S.formOptions}>
          <label htmlFor={rememberId}>
            <input className={S.checkboxInput} type="checkbox" name="" id={rememberId} />
            remember me
          </label>
          <a href="#">register</a>
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
