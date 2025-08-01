import { createPortal } from "react-dom"

interface Props {
  children: React.ReactNode;
}

function ModalPortal({ children }:Props) {
  const el = document.getElementById('modal-root')
  if (!el) return null;
  return createPortal(children, el);
}
export default ModalPortal