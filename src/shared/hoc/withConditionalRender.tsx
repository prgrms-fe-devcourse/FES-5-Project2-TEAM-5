import { matchPath, useLocation } from 'react-router-dom';
import { PATHS } from '../constants/path';

type PathValues = (typeof PATHS)[keyof typeof PATHS];

const hideOnPath: PathValues[] = [
  PATHS.LOGIN,
  PATHS.REGISTER,
  PATHS.AUTH_CALLBACK,
  PATHS.NOT_FOUND,
];

export const withConditionalRender = <P extends object = {}>(
  WrappedComponent: React.ComponentType<P>,
) => {
  return function (props: P) {
    const { pathname } = useLocation();

    const shouldHide = hideOnPath.some((path) => {
      if (path === '*') {
        const validPaths = Object.values(PATHS).filter((p) => p !== '*');
        console.log(validPaths);
        return !validPaths.some((validPath) => matchPath({ path: validPath }, pathname));
      }

      return matchPath({ path }, pathname);
    });

    if (shouldHide) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};
