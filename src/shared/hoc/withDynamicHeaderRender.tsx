import type { CSSProperties } from 'react';
import { useLocation } from 'react-router-dom';
import { PATHS } from '../constants/path';

type PathValues = (typeof PATHS)[keyof typeof PATHS];

const whiteStyle: PathValues[] = [PATHS.HOME, PATHS.MYPAGE, PATHS.DIARY, PATHS.DIARY_FORM];

interface WithStyleProps {
  style: CSSProperties;
}

export const withDynamicHeaderRender = <P extends object = {}>(
  WrappedComponent: React.ComponentType<P & WithStyleProps>,
) => {
  return function (props: P) {
    const { pathname } = useLocation();

    const isWhite = whiteStyle.includes(pathname as PathValues);

    // 공통 색상 스타일
    const style: CSSProperties = {
      color: isWhite ? '#fff' : '#1f1f1f',
      border: isWhite ? '1px solid #fff' : '1px solid #1f1f1f',
    };

    return <WrappedComponent {...props} style={style} />;
  };
};
