import { useScrollTop } from './hook/useScrollTop';
import S from './style.module.css';

interface Props {
  threshold?: number;
  className?: string;
}

export const ScrollTopButton = ({ threshold = 300, className = '' }: Props) => {
  const { isVisible, scrollToTop } = useScrollTop(threshold);

  return (
    <button
      onClick={scrollToTop}
      className={`${S.scrollTopButton} ${isVisible ? S.visible : S.hidden} ${className}`}
      aria-label="맨 위로 가기"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 14L12 9L17 14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};
