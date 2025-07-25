import { GrFormNextLink } from 'react-icons/gr'
import S from './style.module.css'

function NextPageButton() {
  return (
    <section aria-label='페이지 이동' className={S.nextPage}>
      <button type="button">다음으로
        <GrFormNextLink className={S.nextIcon} size={28} />
      </button>
    </section>
  )
}
export default NextPageButton