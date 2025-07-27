import supabase from '../api/supabase/client';
import { getPublicUrl } from '../api/supabase/getPublicUrl';
import { toastUtils } from '../components/Toast';

export const uploadProfileImage = async ({
  file,
  userId,
}: {
  file: File;
  userId: string;
}): Promise<string> => {
  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}.${timestamp}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('profile')
    .upload(filePath, file, { cacheControl: '0', upsert: true });

  if (error || !data) {
    toastUtils.error({ title: '이미지 업로드 실패', message: '이미지 업로드에 실패하였습니다.' });
    throw error;
  }

  return data.path;
};

export const uploadAndGetProfileImageUrl = async (params: {
  file: File;
  userId: string;
}): Promise<string> => {
  const filePath = await uploadProfileImage(params);
  const publicUrl = getPublicUrl({ bucket: 'profile', filePath });

  return publicUrl;
};
