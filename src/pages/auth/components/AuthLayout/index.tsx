import S from './style.module.css';

interface Props {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return (
    <main className={S.container}>
      <div className={S.overlay}>
        <section className={S.section}>{children}</section>
      </div>
    </main>
  );
};
export default AuthLayout;
