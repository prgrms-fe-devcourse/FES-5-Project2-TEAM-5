import type { CSSProperties } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import { PATHS } from '../constants/path';

type PathValues = (typeof PATHS)[keyof typeof PATHS];

const whiteStyle: PathValues[] = [
  PATHS.HOME,
  PATHS.MYPAGE,
  PATHS.DIARY,
  PATHS.DIARY_FORM,
  PATHS.ABOUT,
];

const whiteDynamicPathPatterns = ['/diary/:id', '/users/:id'];

interface WithStyleProps {
  cssOption: CSSProperties;
}

export const withDynamicHeaderRender = <P extends object = {}>(
  WrappedComponent: React.ComponentType<P & WithStyleProps>,
) => {
  return function (props: P) {
    const { pathname } = useLocation();

    const isWhiteStatic = whiteStyle.includes(pathname as PathValues);

    const isWhiteDynamic = whiteDynamicPathPatterns.some((pattern) =>
      matchPath({ path: pattern, end: true }, pathname),
    );

    const isWhite = isWhiteStatic || isWhiteDynamic;

    // 공통 색상 스타일
    const style: CSSProperties = {
      color: isWhite ? '#fff' : '#1f1f1f',
      border: isWhite ? '1px solid #fff' : '1px solid #1f1f1f',
    };

    return <WrappedComponent {...props} cssOption={style} />;
  };
};
