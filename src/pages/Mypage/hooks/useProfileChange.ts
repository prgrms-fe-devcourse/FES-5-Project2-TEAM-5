import type { Tables } from '@/shared/api/supabase/types';
import { removeProfileImage, updateProfileImage, uploadProfileImage } from '@/shared/api/user';

export const useProfileChange = () => {
  const updateProfile = async (
    file: File | null,
    userInfo: Tables<'users'>,
  ): Promise<Tables<'users'>> => {
    try {
      const oldProfilePath = userInfo.profile_image?.split('/').pop();
      if (oldProfilePath) {
        await removeProfileImage(oldProfilePath);
      }
      const publicUrl = file ? await uploadProfileImage({ file, userId: userInfo.id }) : null;

      const user = await updateProfileImage({ url: publicUrl, id: userInfo.id });

      return user;
    } catch (error) {
      throw error;
    }
  };

  return { updateProfile };
};
