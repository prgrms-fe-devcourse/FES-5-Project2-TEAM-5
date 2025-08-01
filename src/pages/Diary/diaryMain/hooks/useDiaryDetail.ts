import { getDiaryDetailById, checkUserLikedDiary } from '@/shared/api/diary';
import { deleteLikeToDiary, postLikeToDiary } from '@/shared/api/like';
import { postLikeNotification } from '@/shared/api/notification';
import supabase from '@/shared/api/supabase/client';
import { type DiaryDetailEntity, type DisplayComment } from '@/shared/types/diary';
import { toastUtils } from '@/shared/components/Toast';
import { useUserContext } from '@/shared/context/UserContext';
import { useState, useEffect, useCallback } from 'react';
import { postCommentNotification } from '@/shared/api/comment';

export const useDiaryDetail = (diaryId: string | undefined) => {
  const [diary, setDiary] = useState<DiaryDetailEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<DisplayComment[]>([]);

  const { userInfo } = useUserContext();

  const fetchComments = useCallback(async (diaryId: string) => {
    try {
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('diary_id', diaryId)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      if (!commentsData || commentsData.length === 0) {
        setComments([]);
        return;
      }

      const userIds = [...new Set(commentsData.map((comment) => comment.user_id))];

      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, name, profile_image')
        .in('id', userIds);

      if (usersError) throw usersError;

      const displayComments: DisplayComment[] = commentsData.map((comment) => {
        const user = usersData?.find((u) => u.id === comment.user_id);

        return {
          id: comment.id,
          author: user?.name || '알 수 없는 사용자',
          content: comment.content,
          timestamp: comment.created_at,
          profile_image_url: user?.profile_image,
          user_id: comment.user_id,
          created_at: comment.created_at,
        };
      });

      setComments(displayComments);
    } catch (error) {
      console.error('댓글 불러오기 실패:', error);
      setComments([]);
    }
  }, []);

  const fetchDiaryDetail = useCallback(async () => {
    if (!diaryId || !userInfo) {
      setError('일기 ID 또는 사용자 정보가 제공되지 않았습니다.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getDiaryDetailById(diaryId);
      setDiary(data);
      setLikesCount(data.likes_count);

      const likedStatus = await checkUserLikedDiary(diaryId, userInfo.id);
      setIsLiked(likedStatus);

      await fetchComments(diaryId);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      console.error('일기 상세 정보 불러오기 실패:', errorMessage);
      setError('일기를 불러오는 데 실패했습니다.');
      toastUtils.error({
        title: '실패',
        message: '일기를 불러오는 데 실패했습니다. 다시 시도해주세요.',
      });
    } finally {
      setLoading(false);
    }
  }, [diaryId, userInfo, fetchComments]);

  useEffect(() => {
    fetchDiaryDetail();
  }, [fetchDiaryDetail]);

  const handleLike = useCallback(async () => {
    if (!diary || !userInfo) return;

    const newIsLiked = !isLiked;
    const newLikesCount = newIsLiked ? likesCount + 1 : likesCount - 1;

    setIsLiked(newIsLiked);
    setLikesCount(newLikesCount);

    try {
      if (newIsLiked) {
        await postLikeToDiary(userInfo.id, diaryId!);

        if (userInfo.id !== diary.user_id) {
          await postLikeNotification(diary.user_id, userInfo.id, diaryId!, userInfo.name);
        }
      } else {
        await deleteLikeToDiary(userInfo.id, diaryId!);
      }
    } catch (error) {
      setIsLiked(!newIsLiked);
      setLikesCount(newIsLiked ? newLikesCount - 1 : newLikesCount + 1);

      if (error instanceof Error) {
        toastUtils.error({
          title: '좋아요 실패',
          message: error.message,
        });
      }
      console.error('좋아요 처리 실패:', error);
    }
  }, [diary, userInfo, isLiked, likesCount, diaryId]);

  const handleAddComment = useCallback(
    async (commentContent: string) => {
      if (!commentContent.trim() || !diary || !userInfo) return;

      try {
        const { data: newComment, error: insertError } = await supabase
          .from('comments')
          .insert({
            content: commentContent,
            diary_id: diaryId!,
            user_id: userInfo.id,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        const newDisplayComment: DisplayComment = {
          id: newComment.id,
          author: userInfo.name,
          content: newComment.content,
          timestamp: newComment.created_at,
          profile_image_url: userInfo.profile_image,
          user_id: newComment.user_id,
          created_at: newComment.created_at,
        };

        setComments((prev) => [...prev, newDisplayComment]);

        if (userInfo.id !== diary.user_id) {
          await postCommentNotification(diary.user_id, userInfo.id, diaryId!, userInfo.name);
        }
      } catch (error) {
        if (error instanceof Error) {
          toastUtils.error({
            title: '댓글 추가 실패',
            message: error.message,
          });
        }
        console.error('댓글 추가 실패:', error);
      }
    },
    [diary, userInfo, diaryId],
  );

  // 댓글 수정
  const handleEditComment = useCallback(
    async (commentId: string, content: string) => {
      if (!userInfo || !content.trim()) return;

      try {
        const { error: updateError } = await supabase
          .from('comments')
          .update({ content: content.trim() })
          .eq('id', commentId)
          .eq('user_id', userInfo.id);

        if (updateError) throw updateError;

        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId ? { ...comment, content: content.trim() } : comment,
          ),
        );
      } catch (error) {
        console.error('댓글 수정 실패:', error);
        throw error;
      }
    },
    [userInfo],
  );

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      if (!userInfo) return;

      try {
        const { error: deleteError } = await supabase
          .from('comments')
          .delete()
          .eq('id', commentId)
          .eq('user_id', userInfo.id);

        if (deleteError) throw deleteError;

        setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      } catch (error) {
        console.error('댓글 삭제 실패:', error);
        throw error;
      }
    },
    [userInfo],
  );

  const handleDelete = useCallback(async () => {
    if (!diaryId) {
      throw new Error('삭제할 일기 ID가 없습니다.');
    }

    const { error } = await supabase.from('diaries').delete().eq('id', diaryId);
    if (error) {
      throw new Error('일기 삭제 실패');
    }
  }, [diaryId]);

  return {
    diary,
    loading,
    error,
    isLiked,
    likesCount,
    comments,
    currentUser: userInfo,
    handleLike,
    handleAddComment,
    handleEditComment,
    handleDeleteComment,
    handleDelete,
    fetchDiaryDetail,
  };
};
