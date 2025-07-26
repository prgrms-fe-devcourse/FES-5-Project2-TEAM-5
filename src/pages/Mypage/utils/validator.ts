import type { ValidationType } from '@/shared/types/validation';
import type { ChangePasswordForm } from './type';

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[^\s]{8,}$/;

export const passwordValidator: ValidationType<ChangePasswordForm> = {
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
