import { GrFormNextLink } from 'react-icons/gr'
import S from './style.module.css'

interface Props {
  onClick?: () => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

function NextPageButton({ onClick, disabled, label = '다음으로', className }: Props) {
  return (
    <section aria-label='페이지 이동' className={`${S.nextPage} ${className || ''}`}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={S.button}
      >
        {label}
        <GrFormNextLink className={S.nextIcon} size={28} />
      </button>
    </section>
  )
}
export default NextPageButton