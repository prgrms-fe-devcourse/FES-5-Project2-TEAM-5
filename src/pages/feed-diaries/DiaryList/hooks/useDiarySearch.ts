import type { Diary } from '@/shared/types/diary';
import type { Emotion } from '@/shared/types/emotion';
import type { Hashtag } from '@/shared/types/hashtag';
import { useMemo } from 'react';

export const useDiariesSearch = (
  diaries: Diary[],
  hashtagsData: Record<string, Hashtag[]>,
  searchTerm: string,
  selectedEmotions: Emotion[] = [],
) => {
  const filteredDiaries = useMemo(() => {
    // 임시저장 이닌 공개된 다이어리 필터링
    const publicDiaries = diaries.filter((diary) => diary.is_public && !diary.is_drafted);
    // 검색어x, 선택된 감정x => 전체 반환
    if (!searchTerm.trim() && selectedEmotions.length <= 0) return publicDiaries;

    let filtered = [...publicDiaries];
    // 감정 필터링
    if (selectedEmotions.length > 0) {
      const selectedEmotionsIds = selectedEmotions.map((emotion) => emotion.id);
      filtered = filtered.filter((diary) => selectedEmotionsIds.includes(diary.emotion_main_id));
    }

    //검색
    if (searchTerm.trim()) {
      // 공백 분리
      const searchTerms = searchTerm
        .toLowerCase()
        .split(' ')
        .filter((term) => term.length > 0);

      filtered = filtered.filter((diary) => {
        // 검색 중 하나라도 매칭되면 검색
        return searchTerms.some((term) => {
          const titleOrContentMatch =
            diary.title.toLowerCase().includes(term) || diary.content.toLowerCase().includes(term);

          const diaryHashtags = hashtagsData[diary.id] || [];
          const hashtagMatch = diaryHashtags.some((hashtag) => {
            const hashtagName = hashtag.name.toLowerCase();
            if (term.startsWith('#')) {
              const searchWithoutHash = term.slice(1);
              return hashtagName.includes(searchWithoutHash);
            } else {
              //일반 검색일 때도 해시태그 검색
              return hashtagName.includes(term);
            }
          });

          return titleOrContentMatch || hashtagMatch;
        });
      });
    }
    return filtered;
  }, [searchTerm, diaries, selectedEmotions, hashtagsData]);

  return {
    filteredDiaries,
  };
};
