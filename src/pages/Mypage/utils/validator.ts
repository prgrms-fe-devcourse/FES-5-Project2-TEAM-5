import type { ValidationType } from '@/shared/types/validation';
import type { ChangePasswordForm } from './type';
import { confirmPasswordValidator, passwordValidator } from '@/shared/utils/validator';

export const validator: ValidationType<ChangePasswordForm> = {
  password: passwordValidator,
  confirmPassword: confirmPasswordValidator,
};
