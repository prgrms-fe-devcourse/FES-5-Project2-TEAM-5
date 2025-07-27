import type { ValidationType } from '@/shared/types/validation';
import type { RegisterForm } from './type';
import {
  confirmPasswordValidator,
  emailValidator,
  nameValidator,
  passwordValidator,
} from '@/shared/utils/validator';

export const registerValidator: ValidationType<RegisterForm> = {
  name: nameValidator,
  email: emailValidator,
  password: passwordValidator,
  confirmPassword: confirmPasswordValidator<RegisterForm>,
};
