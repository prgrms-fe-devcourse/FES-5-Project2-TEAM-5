import Toggle from '@/shared/components/Toggle';
import S from './style.module.css'

interface Props {
  isPublic: boolean;
  onChange: (checked: boolean) => void;
}

function PublicDecision({ isPublic, onChange }: Props) {
  return (
    <section className={S.publicSection}>
      <h3>분석 결과를 다른 사람에게 공개해보세요</h3>
      <Toggle
        checked={isPublic}
        onChange={onChange}
        label="감정 분석 공개"
        showLabel={false}
      />
    </section>
  )
}
export default PublicDecision