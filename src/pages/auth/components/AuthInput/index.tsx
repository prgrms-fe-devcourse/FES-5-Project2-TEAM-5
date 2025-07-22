import S from './style.module.css';

interface Props {
  id: string;
  type: string;
  name: string;
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AuthInput = ({ id, label, name, type, placeholder, onChange, value }: Props) => {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        className={S.input}
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
    </>
  );
};
export default AuthInput;
