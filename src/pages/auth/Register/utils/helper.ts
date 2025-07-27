import supabase from '@/shared/api/supabase/client';
import { toastUtils } from '@/shared/components/Toast';

export const createAuthAccount = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<string> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !data.user) {
    const errorMessage =
      error?.message === 'User already registered'
        ? '이미 등록된 이메일 입니다.'
        : '화원가입에 실패 하였습니다.';
    toastUtils.error({ title: '이메일 등록 실패', message: errorMessage });
    throw error;
  }

  return data.user.id;
};

export const insertUser = async (params: {
  id: string;
  name: string;
  email: string;
  profile_image: string | null;
}): Promise<void> => {
  const { error } = await supabase.from('users').insert(params);

  if (error) {
    toastUtils.error({ title: '사용자 정보 저장 실패', message: '잠시 후 다시 시도 해 주세요.' });
    throw error;
  }
};
