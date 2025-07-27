// loginWithGithub`: Github 계정으로 로그인 (현재 미구현, 향후 추가될 기능)
import type { User } from '@supabase/supabase-js';
import supabase from './supabase/client';

/**
 *  이메일 로그인
 */
export const loginWithEmail = async ({
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
    throw new Error(errorMessage);
  }
};
/**
 *  이메일 회원가입
 */
export const registerWithEmail = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<User> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !data.user) {
    const errorMessage =
      error?.message === 'User already registered'
        ? '이미 등록된 이메일 입니다.'
        : '화원가입에 실패 하였습니다.';
    throw new Error(errorMessage);
  }

  return data.user;
};

/**
 * 로그아웃
 */
export const logout = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error('로그아웃에 실패했습니다.');
  }
};

/**
 * 비밀번호 검증
 */
export const reauthenticate = async ({ email, password }: { email: string; password: string }) => {
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (authError) {
    const errorMessage =
      authError.message === 'Invalid login credentials'
        ? '현재 비밀번호가 올바르지 않습니다.'
        : '인증에 실패했습니다.';
    throw new Error(errorMessage);
  }
};

/**
 * 비밀번호 변경
 */
export const updateUserPassword = async (password: string) => {
  const { error: updateError } = await supabase.auth.updateUser({
    password: password,
  });

  if (updateError) {
    throw new Error('비밀번호 변경에 실패했습니다.');
  }
};

/**
 * 깃허브 로그인
 * TODO: 마지막에 구현
 */
export const loginWithGithub = async () => {};
