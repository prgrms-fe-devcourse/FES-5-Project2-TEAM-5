import supabase from '@/shared/api/supabase/client';

export const getAllDiaryData = async () => {
  const { data, error } = await supabase.from('diaries').select('*');

  if (error || !data) {
    console.error(`전체 유저 정보를 불러오기 실패: ${error}}`);
    return [];
  }
  return data;
};
