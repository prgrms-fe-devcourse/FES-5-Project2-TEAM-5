import supabase from '@/shared/api/supabase/client';
import type { Tables } from '@/shared/api/supabase/types';
import { uploadAndGetProfileImageUrl } from '@/shared/utils/image';

export const useProfileChange = () => {
  const updateProfileImage = async (file: File | null, userInfo: Tables<'users'>) => {
    if (!userInfo) return;
    try {
      const oldProfilePath = userInfo.profile_image?.split('/').pop();
      if (oldProfilePath) {
        const { error: storageError } = await supabase.storage
          .from('profile')
          .remove([oldProfilePath]);

        if (storageError) {
          console.error(`스토리지 프로필 이미지 삭제 실패 : ${storageError}`);
          throw storageError;
        }
      }
      const publicUrl = file
        ? await uploadAndGetProfileImageUrl({ file, userId: userInfo.id })
        : null;

      const { data, error: updateError } = await supabase
        .from('users')
        .update({ profile_image: publicUrl })
        .eq('id', userInfo.id)
        .select()
        .single();

      if (updateError) {
        console.error(`업데이트 이미지 insert 실패 : ${updateError}`);
        throw updateError;
      }

      return data;
    } catch (error) {
      console.error(`updateProfileImage 에러 : ${error}`);
      throw error;
    }
  };

  return { updateProfileImage };
};
