import supabase from '@/shared/supabase/supabase';

export const getPublicUrl = ({
  bucket,
  filePath,
}: {
  bucket: string;
  filePath: string;
}): string => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return data.publicUrl;
};
