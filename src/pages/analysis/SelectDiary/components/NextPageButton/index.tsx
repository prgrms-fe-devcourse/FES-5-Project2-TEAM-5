import { GrFormNextLink } from 'react-icons/gr'
import S from './style.module.css'

interface Props {
  onClick?: () => void;
  disabled?: boolean;
}

function NextPageButton({ onClick, disabled }: Props) {
  return (
    <section aria-label='페이지 이동' className={S.nextPage}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={S.button}
      >다음으로
        <GrFormNextLink className={S.nextIcon} size={28} />
      </button>
    </section>
  )
}
export default NextPageButton