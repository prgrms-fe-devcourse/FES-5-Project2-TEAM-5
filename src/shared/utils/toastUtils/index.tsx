import toast from 'react-hot-toast';
import { IoClose } from 'react-icons/io5';
import { FiInfo } from 'react-icons/fi';
import S from './style.module.css';

interface Props {
  message: string;
  title: string;
}

export const toastUtils = {
  success: ({ message, title }: Props) => {
    toast.dismiss();
    toast.success(
      <div className={S.textArea}>
        <IoClose className={S.closeBtn} onClick={() => toast.dismiss()} />
        <h3>{title}</h3>
        <p>{message}</p>
      </div>,
      {
        iconTheme: {
          primary: '#409EFF',
          secondary: '#fff',
        },
        style: {
          width: '400px',
          border: '3px solid #409EFF',
        },
      },
    );
  },
  error: ({ message, title }: Props) => {
    toast.dismiss();
    toast.error(
      <div className={S.textArea}>
        <IoClose className={S.closeBtn} onClick={() => toast.dismiss()} />
        <h3>{title}</h3>
        <p>{message}</p>
      </div>,
      {
        iconTheme: {
          primary: '#FF4D4F',
          secondary: '#fff',
        },
        style: {
          width: '400px',
          border: '3px solid #FF4D4F',
        },
      },
    );
  },

  info: ({ message, title }: Props) => {
    toast.dismiss();
    toast(
      <div className={S.textArea}>
        <IoClose className={S.closeBtn} onClick={() => toast.dismiss()} />
        <h3>{title}</h3>
        <p>{message}</p>
      </div>,
      {
        icon: <FiInfo size={24} style={{ color: '#5CB85C' }} />,
        iconTheme: {
          primary: '#5CB85C',
          secondary: '#fff',
        },
        style: {
          width: '400px',
          border: '3px solid #5CB85C',
        },
      },
    );
  },
};
