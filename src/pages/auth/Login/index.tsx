import { useId } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';
import logo from '@/assets/logo.png';
import S from './style.module.css';
import { AuthInput, AuthLayout } from '../components';

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
          <AuthInput id={emailId} label="Email" placeholder="Email" name="email" type="email" />
          <AuthInput
            id={pwdId}
            label="Password"
            placeholder="Password"
            name="password"
            type="password"
          />
        </div>
        <div className={S.formOptions}>
          <label htmlFor={rememberId}>
            <input className={S.checkboxInput} type="checkbox" name="" id={rememberId} />
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
