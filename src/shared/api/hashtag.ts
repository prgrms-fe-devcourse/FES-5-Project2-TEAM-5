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

/**
 * 특정 diary들의 해시태그 데이터 조회
 */
export const getAllHashtagsDataByPage = async (
  diaryIds?: string[],
): Promise<Record<string, Hashtag[]>> => {
  let query = supabase.from('diary_hashtags').select(`
    diary_id,
    hashtags (
      id,
      name
    )
  `);

  // 특정 다이어리 ID들만 조회
  if (diaryIds && diaryIds.length > 0) {
    query = query.in('diary_id', diaryIds);
  }

  const { data, error } = await query;

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
