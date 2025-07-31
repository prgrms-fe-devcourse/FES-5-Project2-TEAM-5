import supabase from '@/shared/api/supabase/client';
import { toastUtils } from '@/shared/components/Toast';

export const processHashtags = async (tagStrings: string[]) => {
  if (tagStrings.length === 0) return [];

  const tagNames = tagStrings.map((tag) => (tag.startsWith('#') ? tag.slice(1) : tag));
  const hashtagIds: string[] = [];

  for (const tagName of tagNames) {
    try {
      const { data: existingTag, error: selectError } = await supabase
        .from('hashtags')
        .select('id')
        .eq('name', tagName)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        console.error('해시태그 조회 실패:', selectError);
        continue;
      }

      if (existingTag) {
        hashtagIds.push(existingTag.id);
      } else {
        const { data: newTag, error: insertError } = await supabase
          .from('hashtags')
          .insert({ name: tagName })
          .select('id')
          .single();

        if (insertError) {
          console.error('해시태그 생성 실패:', insertError);
          continue;
        }

        if (newTag) {
          hashtagIds.push(newTag.id);
        }
      }
    } catch (error) {
      console.error('해시태그 처리 중 오류:', error);
    }
  }

  return hashtagIds;
};

export const uploadImageToStorage = async (file: File, userId: string) => {
  const bucketName = 'diary-image';
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage.from(bucketName).upload(fileName, file);

  if (error) {
    console.error('이미지 업로드 실패', error.message);

    if (error.message.includes('Bucket not found')) {
      toastUtils.error({
        title: '설정 오류',
        message: 'Supabase Storage 버킷이 생성되지 않았습니다. 관리자에게 문의하세요.',
      });
    } else {
      toastUtils.error({ title: '실패', message: '이미지 업로드에 실패했습니다.' });
    }
    return null;
  }

  const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(data.path);
  return publicUrlData.publicUrl;
};

export const scrollToElement = (e: HTMLElement | null) => {
  if (e) {
    e.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  }
};
