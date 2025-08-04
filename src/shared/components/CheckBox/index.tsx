import S from './style.module.css'

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  size?: number;
}

function CheckBox({ checked, onChange, label, size = 18 }:Props) {
  return (
    <div className={S.wrapper}>
      <input
        type='checkbox'
        className={S.checkbox}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={`${label} 체크박스`}
        style={{
          width: `${size}px`,
          height: `${size}px`
        }}
      />
    </div>
  )
}
export default CheckBox