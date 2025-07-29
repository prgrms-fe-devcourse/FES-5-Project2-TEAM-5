import type { Diary } from '@/shared/types/diary';
import type { Emotion } from '@/shared/types/emotion';
import { useMemo } from 'react';

export const useDiariesSearch = (
  diaries: Diary[],
  searchTerm: string,
  selectedEmotions: Emotion[] = [],
) => {
  const filteredDiaries = useMemo(() => {
    const publicDiaries = diaries.filter((diary) => diary.is_public && !diary.is_drafted);
    if (!searchTerm.trim() && selectedEmotions.length <= 0) return publicDiaries;

    let filtered = [...publicDiaries];
    if (selectedEmotions.length > 0) {
      const selectedEmotionsIds = selectedEmotions.map((emotion) => emotion.id);
      filtered = filtered.filter((diary) => selectedEmotionsIds.includes(diary.emotion_main_id));
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (diary) =>
          diary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          diary.content.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    return filtered;
  }, [searchTerm, diaries, selectedEmotions]);

  return {
    filteredDiaries,
  };
};
