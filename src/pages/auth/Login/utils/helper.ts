import supabase from '@/shared/supabase/supabase';
import { toastUtils } from '@/shared/utils/toastUtils';

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<void> => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const errorMessage =
      error.message === 'Invalid login credentials'
        ? '입력하신 정보가 정확하지 않습니다.'
        : '로그인에 실패했습니다.';
    toastUtils.error({ title: '로그인 실패', message: errorMessage });
    throw error;
  }
};
