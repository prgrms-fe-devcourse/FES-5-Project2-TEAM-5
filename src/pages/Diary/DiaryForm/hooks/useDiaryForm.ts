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
  const dateInState = location.state?.date;

  const existingDiary = location.state?.diary;
  const isEditMode = !!existingDiary?.id;

  // 임시저장 관련
  const draftKey = isEditMode ? `diary-draft-${existingDiary.id}` : '';
  const {
    storedValue: draftData,
    setStoredValue: saveDraft,
    resetStorage: clearDraft,
  } = useLocalStorage<DraftData | null>(draftKey, null);

  const [formData, setFormData] = useState<FormData>(() => {
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
    return existingDiary?.emotion_main_id || null;
  });

  const [diaryDate, setDiaryDate] = useState(() => {
    // 수정 모드면 해당 일기 날짜 사용
    if (isEditMode && draftData) return draftData.diaryDate;
    if (isEditMode && existingDiary) return existingDiary.created_at?.split('T')[0];
    // 신규면 달력에서 온 날짜(state) 아니면 오늘
    return dateInState || new Date().toISOString().split('T')[0];
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(() => {
    return existingDiary?.diary_image || null;
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(() => {
    if (isEditMode && draftData?.lastSaved) {
      return new Date(draftData.lastSaved);
    }
    return null;
  });

  const handleCancel = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        '저장하지 않은 변경사항이 있습니다. 정말 나가시겠습니까?',
      );
      if (confirmLeave) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  }, [hasUnsavedChanges, navigate]);

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

  const saveToLocalStorage = useCallback(() => {
    if (!isEditMode) return;

    if (!hasUnsavedChanges) {
      toastUtils.info({
        title: '알림',
        message: '수정한 내용이 없습니다.',
      });
      return;
    }

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
  }, [
    isEditMode,
    hasUnsavedChanges,
    formData,
    selectedEmotionId,
    diaryDate,
    imagePreviewUrl,
    saveDraft,
  ]);

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
  useEffect(() => {
    if (!isEditMode) return;

    const hasChanges =
      formData.title !== (existingDiary?.title || '') ||
      formData.content !== (existingDiary?.content || '') ||
      formData.isPublic !== (existingDiary?.is_public ?? true) ||
      selectedEmotionId !== (existingDiary?.emotion_main_id || null);

    setHasUnsavedChanges(hasChanges);
  }, [formData, selectedEmotionId, isEditMode, existingDiary]);

  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [hasCheckedDraft, setHasCheckedDraft] = useState(false);

  // 임시저장된 내용이 현재 내용과 다른지 확인하는 함수
  const isDraftDifferentFromCurrent = useCallback(
    (draft: DraftData) => {
      const currentData = {
        title: existingDiary?.title || '',
        content: existingDiary?.content || '',
        isPublic: existingDiary?.is_public ?? true,
        selectedEmotionId: existingDiary?.emotion_main_id || null,
      };

      return (
        draft.title !== currentData.title ||
        draft.content !== currentData.content ||
        draft.isPublic !== currentData.isPublic ||
        draft.selectedEmotionId !== currentData.selectedEmotionId
      );
    },
    [existingDiary],
  );

  useEffect(() => {
    if (hasCheckedDraft) return;

    if (isEditMode && draftData && draftData.lastSaved) {
      const lastSavedDate = new Date(draftData.lastSaved);
      const now = new Date();
      const timeDiff = now.getTime() - lastSavedDate.getTime();

      // 24시간 이내 && 임시저장 내용이 현재 내용과 다를 때만 복원 제안
      if (timeDiff < 24 * 60 * 60 * 1000 && isDraftDifferentFromCurrent(draftData)) {
        setShowRestoreDialog(true);
      }
      setHasCheckedDraft(true);
    } else {
      setHasCheckedDraft(true);
    }
  }, [isEditMode, draftData, hasCheckedDraft, isDraftDifferentFromCurrent]);

  const handleRestoreConfirm = useCallback(() => {
    restoreFromDraft();
    setShowRestoreDialog(false);
  }, [restoreFromDraft]);

  const handleRestoreCancel = useCallback(() => {
    setShowRestoreDialog(false);
    toastUtils.info({
      title: '알림',
      message: '원본 내용으로 진행합니다.',
    });
  }, []);

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
    handleCancel,
    showRestoreDialog,
    handleRestoreConfirm,
    handleRestoreCancel,
    hasCheckedDraft,
  };
};
