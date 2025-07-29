import { type ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserContext } from '@/shared/context/UserContext';
import { toastUtils } from '@/shared/components/Toast';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isAuth } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (hasChecked && !isAuth) {
      toastUtils.error({
        title: '로그인 필요',
        message: '로그인 후 이용해 주세요.',
      });

      navigate('/login', {
        state: { from: location.pathname },
        replace: true,
      });
      return;
    }

    // 초기 체크 완료 표시 (약간의 지연)
    if (!hasChecked) {
      const timer = setTimeout(() => {
        setHasChecked(true);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isAuth, hasChecked, navigate, location.pathname]);

  // 인증 상태 체크 전이거나 인증되지 않은 경우
  if (!hasChecked || !isAuth || !user) {
    return (
      <div className="loading-container">
        <span className="spinner"></span>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
