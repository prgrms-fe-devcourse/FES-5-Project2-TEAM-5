import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserContext } from '@/shared/context/UserContext';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { toastUtils } from '@/shared/components/Toast';
import type { EmotionMain } from '@/shared/types/diary';

export interface FormData {
  emotion: string;
  title: string;
  content: string;
  isPublic: boolean;
  image?: File | null;
  tags?: string[];
}

export interface DraftData {
  emotion: string;
  title: string;
  content: string;
  isPublic: boolean;
  tags: string[];
  selectedEmotionId: number | null;
  diaryDate: string;
  imagePreviewUrl?: string | null;
  lastSaved: number;
}

export const useDiaryForm = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();

  const existingDiary = location.state?.diary;
  const isEditMode = !!existingDiary?.id;

  // 임시저장 관련
  const draftKey = isEditMode ? `diary-draft-${existingDiary.id}` : '';
  const {
    storedValue: draftData,
    setStoredValue: saveDraft,
    resetStorage: clearDraft,
  } = useLocalStorage<DraftData | null>(draftKey, null);

  // 폼 상태들

  const [formData, setFormData] = useState<FormData>(() => {
    if (isEditMode && draftData) {
      return {
        emotion: draftData.emotion,
        title: draftData.title,
        content: draftData.content,
        isPublic: draftData.isPublic,
        image: null,
        tags: draftData.tags,
      };
    }
    return {
      emotion: existingDiary?.emotion_mains?.name || '',
      title: existingDiary?.title || '',
      content: existingDiary?.content || '',
      isPublic: existingDiary?.is_public ?? true,
      image: null,

      tags:
        (existingDiary?.diary_hashtags as Array<{ hashtags: { name: string } }> | undefined)?.map(
          (h) => `#${h.hashtags.name}`,
        ) || [],
    };
  });

  const [selectedEmotionId, setSelectedEmotionId] = useState<number | null>(() => {
    if (isEditMode && draftData) return draftData.selectedEmotionId;
    return existingDiary?.emotion_main_id || null;
  });

  const [diaryDate, setDiaryDate] = useState<string>(() => {
    if (isEditMode && draftData) return draftData.diaryDate;
    return existingDiary?.created_at?.split('T')[0] ?? new Date().toISOString().split('T')[0];
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(() => {
    if (isEditMode && draftData?.imagePreviewUrl !== undefined) {
      return draftData.imagePreviewUrl;
    }
    return existingDiary?.diary_image || null;
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(() => {
    if (isEditMode && draftData?.lastSaved) {
      return new Date(draftData.lastSaved);
    }
    return null;
  });

  // 입력 핸들러들
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleEmotionSelect = useCallback((id: number, emotions: EmotionMain[]) => {
    setSelectedEmotionId((prev) => (prev === id ? null : id));
    const emotionName = emotions.find((emo) => emo.id === id)?.name || '';
    setFormData((prev) => ({ ...prev, emotion: emotionName }));
  }, []);

  // 임시저장 관련 함수들
  const saveToLocalStorage = useCallback(() => {
    if (!isEditMode) return;

    const currentDraft: DraftData = {
      emotion: formData.emotion,
      title: formData.title,
      content: formData.content,
      isPublic: formData.isPublic,
      tags: formData.tags || [],
      selectedEmotionId: selectedEmotionId,
      diaryDate: diaryDate,
      imagePreviewUrl: imagePreviewUrl,
      lastSaved: Date.now(),
    };

    saveDraft(currentDraft);
    setLastSavedTime(new Date());
    setHasUnsavedChanges(false);

    toastUtils.success({
      title: '임시저장 완료',
      message: '수정 내용이 임시 저장되었습니다.',
    });
  }, [isEditMode, formData, selectedEmotionId, diaryDate, imagePreviewUrl, saveDraft]);

  const restoreFromDraft = useCallback(() => {
    if (!isEditMode || !draftData) return;

    setFormData({
      emotion: draftData.emotion,
      title: draftData.title,
      content: draftData.content,
      isPublic: draftData.isPublic,
      image: null,
      tags: draftData.tags,
    });

    setSelectedEmotionId(draftData.selectedEmotionId);
    setDiaryDate(draftData.diaryDate);
    setImagePreviewUrl(draftData.imagePreviewUrl || null);
    setHasUnsavedChanges(false);

    toastUtils.success({
      title: '복원 완료',
      message: '임시저장된 내용을 복원했습니다.',
    });
  }, [isEditMode, draftData]);

  // 변경사항 감지
  useEffect(() => {
    if (!isEditMode) return;

    const hasChanges =
      formData.title !== (existingDiary?.title || '') ||
      formData.content !== (existingDiary?.content || '') ||
      formData.isPublic !== (existingDiary?.is_public ?? true) ||
      selectedEmotionId !== (existingDiary?.emotion_main_id || null);

    setHasUnsavedChanges(hasChanges);
  }, [formData, selectedEmotionId, isEditMode, existingDiary]);

  return {
    formData,
    setFormData,
    selectedEmotionId,
    setSelectedEmotionId,
    diaryDate,
    setDiaryDate,
    imagePreviewUrl,
    setImagePreviewUrl,
    hasUnsavedChanges,
    lastSavedTime,

    existingDiary,
    isEditMode,
    user,
    navigate,
    draftData,
    clearDraft,

    handleInputChange,
    handleEmotionSelect,
    saveToLocalStorage,
    restoreFromDraft,
  };
};
