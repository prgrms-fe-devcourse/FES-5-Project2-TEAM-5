import type { Tables } from '@/shared/api/supabase/types';
import { removeProfileImage, updateProfileImage, uploadProfileImage } from '@/shared/api/user';

export const useProfileChange = () => {
  const updateProfile = async (
    file: File | null,
    userInfo: Tables<'users'>,
  ): Promise<Tables<'users'>> => {
    try {
      const oldProfilePath = userInfo.profile_image?.split('/').pop();
      // storage 이미지 삭제
      if (oldProfilePath) {
        await removeProfileImage(oldProfilePath);
      }
      // 이미지 업로드
      const publicUrl = file ? await uploadProfileImage({ file, userId: userInfo.id }) : null;

      // users 테이블 업데이트
      const user = await updateProfileImage({ url: publicUrl, id: userInfo.id });

      return user;
    } catch (error) {
      throw error;
    }
  };

  return { updateProfile };
};
