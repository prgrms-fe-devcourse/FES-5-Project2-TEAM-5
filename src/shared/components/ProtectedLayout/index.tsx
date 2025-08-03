import { useUserContext } from '@/shared/context/UserContext';
import { Outlet, Navigate } from 'react-router-dom';
import Spinner from '../Spinner';
import { PATHS } from '@/shared/constants/path';

export const ProtectedLayout = () => {
  const { isAuth, isLoading } = useUserContext();

  if (isLoading) {
    return <Spinner />;
  }

  if (!isAuth) {
    return <Navigate to={PATHS.HOME} replace state={{ message: '로그인이 필요합니다.' }} />;
  }

  return <Outlet />;
};
