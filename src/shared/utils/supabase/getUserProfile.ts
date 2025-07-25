import supabase from '@/shared/supabase/supabase';

export const getUserProfile = async (userId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('profile_image')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error(`getUserProfile 프로필 이미지 불러오기 실패 : ${error}`);
    return null;
  }

  return data.profile_image;
};
