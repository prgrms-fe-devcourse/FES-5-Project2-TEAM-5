import type { Hashtag } from '../types/hashtag';
import supabase from './supabase/client';

export const getAllHashtagsData = async () => {
  const { data, error } = await supabase.from('diary_hashtags').select(
    `
    diary_id,
      hashtags (
        id,
        name
      )
    `,
  );

  if (error) {
    throw new Error(`해시태그 조회 실패: ${error.message}`);
  }
  const hashGroup: Record<string, Hashtag[]> = {};

  data.forEach((item) => {
    if (!item.hashtags || !item.diary_id) return;
    if (!hashGroup[item.diary_id]) {
      hashGroup[item.diary_id] = [];
    }
    hashGroup[item.diary_id].push(item.hashtags);
  });

  return hashGroup;
};
