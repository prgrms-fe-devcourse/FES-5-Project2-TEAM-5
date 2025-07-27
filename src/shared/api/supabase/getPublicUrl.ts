import supabase from './client';

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
