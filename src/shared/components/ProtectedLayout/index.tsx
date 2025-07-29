import { useUserContext } from '@/shared/context/UserContext';
import { Outlet, Navigate } from 'react-router-dom';
import { toastUtils } from '../Toast';

export const ProtectedLayout = () => {
  const { isAuth } = useUserContext();

  if (!isAuth) {
    toastUtils.info({ title: '로그인 필요', message: '해당 서비스는 로그인이 필요합니다.' });
    return <Navigate to={'/login'} />;
  }

  return <Outlet />;
};
