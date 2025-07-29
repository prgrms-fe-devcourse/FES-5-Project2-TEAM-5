import S from './style.module.css';

const Spinner = () => {
  return (
    <div className={S.spinnerWrapper}>
      <div className={S.spinner}></div>
    </div>
  );
};
export default Spinner;