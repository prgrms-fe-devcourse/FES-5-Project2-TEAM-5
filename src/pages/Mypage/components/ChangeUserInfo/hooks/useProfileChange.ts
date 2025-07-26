import { uploadAndGetProfileImageUrl } from '@/shared/helpers/image';
import { useUser } from '@/shared/hooks/useUser';

export const useProfileChange = () => {
  const { userInfo } = useUser();

  const updateProfileImage = async (file: File) => {
    if (!userInfo) return;

    try {
      await uploadAndGetProfileImageUrl({ file: file, userId: userInfo.id });
    } catch (error) {
      console.error(`updateProfileImage 에러 : ${error}`);
    }
  };

  return { updateProfileImage };
};
