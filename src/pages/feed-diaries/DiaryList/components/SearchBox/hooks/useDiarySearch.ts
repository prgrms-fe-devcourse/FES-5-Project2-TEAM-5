import { useMemo } from 'react';
import type { Diary } from '../type/diary';

export const useDiariesSearch = (diaries: Diary[], searchTerm: string) => {
  const filteredDiaries = useMemo(() => {
    const publicDiaries = diaries.filter((diary) => diary.is_public && !diary.is_drafted);
    if (!searchTerm.trim()) return publicDiaries;

    return diaries.filter(
      (diary) =>
        (diary.is_public && diary.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        diary.content.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, diaries]);

  return {
    filteredDiaries,
  };
};
