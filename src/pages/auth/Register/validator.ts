import type { IRegisterForm, RegisterValidationType } from './type';

const EMAIL_REGEX = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[^\s]{8,}$/;

export const registerValidator: RegisterValidationType<IRegisterForm> = {
  name: (value: string): string => {
    if (!value.trim()) return '닉네임을 입력해주세요.';
    if (!(value.length >= 2)) return '닉네임은 최소 2글자 이상 작성해주세요.';
    return '';
  },
  email: (value: string): string => {
    if (!value.trim()) return '이메일을 입력해주세요.';
    if (!EMAIL_REGEX.test(value)) return '이메일 형식에 맞지 않습니다.';
    return '';
  },
  password: (value: string): string => {
    if (!value.trim()) return '비밀번호를 입력해주세요.';
    if (!PASSWORD_REGEX.test(value)) return '8자 이상, 문자, 숫자, 특수문자를 포함해야 합니다.';
    return '';
  },
  confirmPassword: (value: string, values?: { password: string }): string => {
    if (!value.trim()) return '비밀번호 확인을 입력해주세요.';

    if (values && value !== values.password) {
      return '비밀번호가 일치하지 않습니다.';
    }
    return '';
  },
};
