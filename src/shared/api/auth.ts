// loginWithEmail`: 이메일/비밀번호로 로그인 (Login/utils/helper.ts의 login 함수)
// registerWithEmail`: 이메일/비밀번호로 신규 계정 생성 (Register/utils/helper.ts의 createAuthAccount 함수)
// logout`: 현재 세션에서 로그아웃 (useUser 훅에 있던 로직)
// reauthenticate`: 현재 비밀번호로 재인증 (ChangePassword/index.tsx의 signInWithPassword 호출 부분)
// updateUserPassword`: 로그인된 사용자의 비밀번호 변경 (ChangePassword/index.tsx의 updateUser 호출 부분)
// loginWithGithub`: Github 계정으로 로그인 (현재 미구현, 향후 추가될 기능)
import supabase from './supabase/client';

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
