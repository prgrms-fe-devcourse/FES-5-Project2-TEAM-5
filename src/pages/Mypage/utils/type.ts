export type TabType = 'diary' | 'changeInfo';
export type Tab = { id: TabType; label: string };

export interface ChangePasswordForm {
  password: string;
  confirmPassword: string;
}
