import { useEffect, useState } from 'react';

/**
 * 이미지를 업로드 할때 preview 이미지를 제공하고 ImageFile를 제공합니다.
 * @returns
 */
export const useUploadImage = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const onPreviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setImageFile(file);
    }
  };

  return {
    imagePreview,
    onChange: onPreviewChange,
    imageFile,
  };
};
