import S from './style.module.css';

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  showLabel?: boolean;
}

function Toggle({ checked, onChange, label, showLabel = true }:Props) {
  const ariaLabel = label ? `${label} 토글 버튼` : '토글 버튼';

  return (
    <div className={S.wrapper}>
      <button
        type="button"
        className={`${S.toggle} ${checked ? S.on : ''}`}
        onClick={() => onChange(!checked)}
        aria-label= {ariaLabel}
        aria-pressed={checked}
      >
        <span className={S.circle} />
      </button>

      {label && showLabel && (
        <span className={S.label}>{label}</span>
      )}
    </div>
  );
}
export default Toggle