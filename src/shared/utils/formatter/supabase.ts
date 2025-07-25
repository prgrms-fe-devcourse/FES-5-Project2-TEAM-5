import type { DiaryRowEntity, SupabaseDiaryResponse } from '@/shared/types/diary';

export const transformDiaryData = (diaries: SupabaseDiaryResponse[]): DiaryRowEntity[] => {
  return diaries.map((diary) => ({
    id: diary.id,
    title: diary.title,
    created_at: diary.created_at,
    is_public: diary.is_public,
    diary_image: diary.diary_image,
    likes: diary.likes[0].count || 0,
    comments: diary.comments[0].count || 0,
    diary_hashtags:
      diary.diary_hashtags
        ?.flatMap((dh) => dh.hashtags)
        ?.map((hashtag) => ({ id: hashtag.id, name: hashtag.name })) || [],
    emotion_mains: diary.emotion_mains?.[0] || { name: '', icon_url: '' },
  }));
};
