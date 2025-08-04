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

const areTagsEqual = (tags1: string[] = [], tags2: string[] = []): boolean => {
  if (tags1.length !== tags2.length) return false;
  return tags1.every((tag, index) => tag === tags2[index]);
};

export const useDiaryForm = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();
  const dateInState = location.state?.date;

  const existingDiary = location.state?.diary;
  const isEditMode = !!existingDiary?.id;

  const initialDiaryDate: string = (() => {
    // 수정 모드면 해당 일기 날짜 사용
    if (isEditMode && existingDiary) {
      const result =
        existingDiary.created_at?.split('T')[0] || new Date().toISOString().split('T')[0];
      return result;
    }
    // 신규면 달력에서 온 날짜(state) 아니면 오늘
    const result = dateInState || new Date().toISOString().split('T')[0];
    return result;
  })();

  // 임시저장 관련 - 신규 작성은 날짜별로, 수정 모드는 일기 ID별로
  const draftKey: string = isEditMode
    ? `diary-draft-${existingDiary.id}`
    : `diary-new-draft-${user?.id || 'anonymous'}-${initialDiaryDate}`; // 날짜별 임시저장

  const {
    storedValue: draftData,
    setStoredValue: saveDraft,
    resetStorage: clearDraft,
  } = useLocalStorage<DraftData | null>(draftKey, null);

  // 복원 트리거 상태 추가
  const [restoreTrigger, setRestoreTrigger] = useState(0);

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
    // 수정 모드면서 임시저장 데이터가 있으면 임시저장된 날짜 사용
    if (isEditMode && draftData?.diaryDate) return draftData.diaryDate;
    // 아니면 초기 계산값 사용
    return initialDiaryDate;
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(() => {
    return existingDiary?.diary_image || null;
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(() => {
    if (draftData?.lastSaved) {
      return new Date(draftData.lastSaved);
    }
    return null;
  });

  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCancel = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowCancelModal(true);
    } else {
      navigate(-1);
    }
  }, [hasUnsavedChanges, navigate]);

  const handleCancelConfirm = useCallback(() => {
    setShowCancelModal(false);
    // 신규 작성 시에만 임시저장 데이터 삭제
    if (!isEditMode) {
      clearDraft();
    }
    navigate(-1);
  }, [navigate, isEditMode, clearDraft]);

  const handleCancelModalCancel = useCallback(() => {
    setShowCancelModal(false);
  }, []);

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

  const saveToLocalStorage = useCallback(
    (currentTags?: string[], imageFile?: File | null, currentImagePreviewUrl?: string | null) => {
      if (!hasUnsavedChanges) {
        toastUtils.info({
          title: '알림',
          message: isEditMode ? '수정한 내용이 없습니다.' : '작성한 내용이 없습니다.',
        });
        return;
      }

      const currentDraft: DraftData = {
        emotion: formData.emotion,
        title: formData.title,
        content: formData.content,
        isPublic: formData.isPublic,
        tags: currentTags || formData.tags || [],
        selectedEmotionId: selectedEmotionId,
        diaryDate: diaryDate,
        imagePreviewUrl: currentImagePreviewUrl || imagePreviewUrl,
        lastSaved: Date.now(),
      };

      saveDraft(currentDraft);
      setLastSavedTime(new Date());
      setHasUnsavedChanges(false);

      const originalImageUrl = existingDiary?.diary_image || null;
      const currentImageUrl = currentImagePreviewUrl || imagePreviewUrl;

      const hasNewImageFile = !!imageFile;
      const hasImageUrlChanged = currentImageUrl !== originalImageUrl;
      const hasImageChanges = hasNewImageFile || hasImageUrlChanged;

      if (hasImageChanges) {
        toastUtils.info({
          title: '안내',
          message: isEditMode
            ? '이미지 변경사항은 실제 저장 시에만 반영됩니다.'
            : '이미지는 실제 저장 시에만 업로드됩니다.',
        });
      } else {
        toastUtils.success({
          title: '임시저장 완료',
          message: isEditMode
            ? '수정 내용이 임시 저장되었습니다.'
            : '작성 내용이 임시 저장되었습니다.',
        });
      }
    },
    [
      hasUnsavedChanges,
      formData,
      selectedEmotionId,
      diaryDate,
      imagePreviewUrl,
      saveDraft,
      isEditMode,
      existingDiary,
    ],
  );

  const restoreFromDraft = useCallback(() => {
    if (!draftData) return;

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

    setRestoreTrigger((prev) => prev + 1);

    toastUtils.success({
      title: '복원 완료',
      message: '임시저장된 내용을 복원했습니다.',
    });
  }, [draftData]);

  useEffect(() => {
    let hasChanges: boolean = false;

    if (isEditMode) {
      // 수정 모드: 기존 일기와 비교
      const existingTags =
        (existingDiary?.diary_hashtags as Array<{ hashtags: { name: string } }> | undefined)?.map(
          (h) => `#${h.hashtags.name}`,
        ) || [];

      // 이미지 변경 감지 추가
      const originalImageUrl = existingDiary?.diary_image || null;
      const currentImageUrl = imagePreviewUrl;
      const hasImageChanged = currentImageUrl !== originalImageUrl;

      hasChanges =
        formData.title !== (existingDiary?.title || '') ||
        formData.content !== (existingDiary?.content || '') ||
        formData.isPublic !== (existingDiary?.is_public ?? true) ||
        selectedEmotionId !== (existingDiary?.emotion_main_id || null) ||
        !areTagsEqual(formData.tags || [], existingTags) ||
        hasImageChanged;
    } else {
      // 신규 작성: 빈 상태와 비교
      hasChanges =
        formData.title.trim() !== '' ||
        formData.content.trim() !== '' ||
        formData.isPublic !== true ||
        selectedEmotionId !== null ||
        Boolean(formData.tags && formData.tags.length > 0) ||
        Boolean(imagePreviewUrl);
    }

    setHasUnsavedChanges(hasChanges);
  }, [
    // 의존성 배열을 구체적으로 명시
    formData.title,
    formData.content,
    formData.isPublic,
    formData.tags,
    selectedEmotionId,
    imagePreviewUrl,
    isEditMode,
    existingDiary?.title,
    existingDiary?.content,
    existingDiary?.is_public,
    existingDiary?.emotion_main_id,
    existingDiary?.diary_hashtags,
    existingDiary?.diary_image,
  ]);

  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [hasCheckedDraft, setHasCheckedDraft] = useState(false);

  // 임시저장된 내용이 현재 내용과 다른지 확인하는 함수
  const isDraftDifferentFromCurrent = useCallback(
    (draft: DraftData): boolean => {
      if (isEditMode) {
        // 수정 모드: 기존 일기와 비교
        const existingTags =
          (existingDiary?.diary_hashtags as Array<{ hashtags: { name: string } }> | undefined)?.map(
            (h) => `#${h.hashtags.name}`,
          ) || [];

        const currentData = {
          title: existingDiary?.title || '',
          content: existingDiary?.content || '',
          isPublic: existingDiary?.is_public ?? true,
          selectedEmotionId: existingDiary?.emotion_main_id || null,
          tags: existingTags,
        };

        return (
          draft.title !== currentData.title ||
          draft.content !== currentData.content ||
          draft.isPublic !== currentData.isPublic ||
          draft.selectedEmotionId !== currentData.selectedEmotionId ||
          !areTagsEqual(draft.tags || [], currentData.tags)
        );
      } else {
        // 신규 작성: 빈 상태와 비교
        return (
          draft.title.trim() !== '' ||
          draft.content.trim() !== '' ||
          draft.isPublic !== true ||
          draft.selectedEmotionId !== null ||
          Boolean(draft.tags && draft.tags.length > 0)
        );
      }
    },
    [existingDiary, isEditMode],
  );

  useEffect(() => {
    if (hasCheckedDraft) return;

    if (draftData && draftData.lastSaved) {
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
  }, [draftData, hasCheckedDraft, isDraftDifferentFromCurrent]);

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

    showCancelModal,
    handleCancelConfirm,
    handleCancelModalCancel,
    restoreTrigger,
  };
};
