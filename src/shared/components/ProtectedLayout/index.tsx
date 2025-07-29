import { useUserContext } from '@/shared/context/UserContext';
import { Outlet, Navigate } from 'react-router-dom';
import { toastUtils } from '../Toast';
import Spinner from '../Spinner';

export const ProtectedLayout = () => {
  const { isAuth, isLoading } = useUserContext();

  if (isLoading) {
    return <Spinner />;
  }

  if (!isAuth) {
    toastUtils.info({ title: '로그인 필요', message: '해당 서비스는 로그인이 필요합니다.' });
    return <Navigate to={'/login'} />;
  }

  return <Outlet />;
};
