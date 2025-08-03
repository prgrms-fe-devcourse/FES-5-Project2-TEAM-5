import Spinner from '@/shared/components/Spinner';
import { toastUtils } from '@/shared/components/Toast';
import { PATHS } from '@/shared/constants/path';
import { useUserContext } from '@/shared/context/UserContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const { isAuth, isLoading } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuth) {
        toastUtils.success({ title: 'github', message: 'github 인증 성공' });
        navigate(PATHS.HOME);
      } else {
        toastUtils.error({ title: 'github', message: 'github 인증 실패' });
        navigate(PATHS.LOGIN);
      }
    }
  }, [isAuth, isLoading]);

  return <Spinner />;
};
export default AuthCallback;
