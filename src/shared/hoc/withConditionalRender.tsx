import { useLocation } from 'react-router-dom';

export const withConditionalRender = <P extends object = {}>(
  WrappedComponent: React.ComponentType<P>,
  hideOnPath: string[],
) => {
  return function (props: P) {
    const location = useLocation();

    if (hideOnPath.includes(location.pathname)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};
