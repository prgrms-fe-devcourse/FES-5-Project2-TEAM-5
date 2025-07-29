import { useLocation } from 'react-router-dom';
import { PATHS } from '../constants/path';

type PathValues = (typeof PATHS)[keyof typeof PATHS];

const hideOnPath: PathValues[] = [PATHS.LOGIN, PATHS.REGISTER, PATHS.AUTH_CALLBACK];

export const withConditionalRender = <P extends object = {}>(
  WrappedComponent: React.ComponentType<P>,
) => {
  return function (props: P) {
    const { pathname } = useLocation();

    if (hideOnPath.includes(pathname as PathValues)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};
