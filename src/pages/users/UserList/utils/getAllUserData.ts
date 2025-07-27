import type { DbUser } from '@/pages/users/UserList/types/dbUser';
import supabase from '@/shared/api/supabase/client';

export const getAllUserData = async (): Promise<DbUser[]> => {
  const { data, error } = await supabase.from('users').select('*');

  if (error || !data) {
    console.error(`전체 유저 정보를 불러오기 실패: ${error}}`);
    return [];
  }
  return data;
};
