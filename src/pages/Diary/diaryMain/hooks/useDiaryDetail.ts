import { deleteDiaryById, getDiaryDetailById } from '@/shared/api/diary';
import type { SupabaseDiaryResponse } from '@/shared/types/diary';
import { useState, useEffect, useCallback } from 'react';

interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  profile_image_url?: string;
}

export const useDiaryDetail = (diaryId: string | undefined) => {
  const [diary, setDiary] = useState<SupabaseDiaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);

  // 일기 상세 정보 불러오기
  const fetchDiaryDetail = useCallback(async () => {
    if (!diaryId) {
      setError('일기 ID가 제공되지 않았습니다.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getDiaryDetailById(diaryId);
      setDiary(data);
      setIsLiked(false);
      setLikesCount(0);
      setComments([]);
    } catch (err: any) {
      console.error('일기 상세 정보 불러오기 실패:', err.message);
      setError('일기를 불러오는 데 실패했습니다: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [diaryId]);

  useEffect(() => {
    fetchDiaryDetail();
  }, [fetchDiaryDetail]);

  const handleLike = useCallback(async () => {
    if (!diary) return;

    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked((prev) => !prev);
  }, [diary, isLiked]);

  // 댓글 추가 핸들러
  const handleAddComment = useCallback(
    async (commentContent: string) => {
      if (!commentContent.trim() || !diary) return;

      const newCommentObj: Comment = {
        id: Date.now(),
        author: '나',
        content: commentContent,
        timestamp: new Date()
          .toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
          .replace(/\.\s/g, '.')
          .slice(0, -1),
        profile_image_url: '/src/assets/icon_expect.svg', // 임시 프로필 이미지
      };

      setComments((prev) => [...prev, newCommentObj]);
    },
    [diary],
  );

  // 일기 삭제 핸들러
  const handleDelete = useCallback(async () => {
    if (!diaryId) {
      throw new Error('삭제할 일기 ID가 없습니다.');
    }
    await deleteDiaryById(diaryId);
  }, [diaryId]);

  return {
    diary,
    loading,
    error,
    isLiked,
    likesCount,
    comments,
    handleLike,
    handleAddComment,
    handleDelete,
    fetchDiaryDetail,
  };
};
