import S from './style.module.css';
import { useEffect, useId, useRef, useState, useCallback } from 'react';
import { useUploadImage } from '@/shared/hooks';
import { BsCheckSquare, BsCheckSquareFill } from 'react-icons/bs';
import DiaryWeather from '@/shared/components/DiaryWeather';
import { toastUtils } from '@/shared/components/Toast';
import Spinner from '@/shared/components/Spinner';

import { useDiaryForm } from './hooks/useDiaryForm';
import { useEmotions } from './hooks/useEmotions';
import { useTags } from './hooks/useTags';
import { processHashtags, uploadImageToStorage, scrollToElement } from './utils/diaryFormUtils';
import { ImageUpload } from './components/ImageUpload';
import supabase from '@/shared/api/supabase/client';
import { EmotionSelector } from './components/EmotionSelector';
import ConfirmModal from '@/shared/components/Modal/ConfirmModal';

const DiaryFormPage = () => {
  const {
    formData,
    setFormData,
    selectedEmotionId,
    diaryDate,
    imagePreviewUrl,
    setImagePreviewUrl,
    existingDiary,
    isEditMode,
    user,
    navigate,
    clearDraft,
    handleInputChange,
    handleEmotionSelect,
    handleCancel,
    showRestoreDialog,
    handleRestoreConfirm,
    handleRestoreCancel,
    saveToLocalStorage,
    showCancelModal,
    handleCancelConfirm,
    handleCancelModalCancel,
    restoreTrigger,
  } = useDiaryForm();

  const { emotions, isLoadingEmotions } = useEmotions();

  const {
    tagInput,
    tags,
    handleTagInputChange,
    handleTagInputKeyDown,
    removeTag,
    setTagInput,
    setTags,
  } = useTags(formData.tags);

  useEffect(() => {
    if (restoreTrigger > 0) {
      const currentFormData = formData;
      if (currentFormData.tags && currentFormData.tags.length > 0) {
        const tagString = currentFormData.tags.join(' ');
        setTagInput(tagString);
        setTags(currentFormData.tags);
      } else {
        setTagInput('');
        setTags([]);
      }
    }
  }, [restoreTrigger, formData.tags, setTagInput, setTags]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, tags }));
  }, [tags, setFormData]);

  const titleId = useId();
  const contentId = useId();
  const imageId = useId();
  const tagId = useId();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  const emotionSectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const { imagePreview, imageFile, onChange: handleImageChange, clearImage } = useUploadImage();

  useEffect(() => {
    if (imagePreview) {
      setImagePreviewUrl(imagePreview);
    } else if (!imageFile && !existingDiary?.diary_image) {
      setImagePreviewUrl(null);
    }
  }, [imagePreview, imageFile, existingDiary?.diary_image, setImagePreviewUrl]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, image: imageFile }));
  }, [imageFile, setFormData]);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
      if (imagePreviewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreview, imagePreviewUrl]);

  const [selected, setSelected] = useState<'public' | 'private'>(
    formData.isPublic ? 'public' : 'private',
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as 'public' | 'private';
    setSelected(value);
    setFormData((prev) => ({
      ...prev,
      isPublic: value === 'public',
    }));
  };

  const handleSaveDraft = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    saveToLocalStorage(tags, imageFile);
  };

  const handleTagChange = (value: string) => {
    handleTagInputChange(value);
  };

  const handleRemoveTag = (index: number) => {
    removeTag(index);
  };

  // 이미지 정리 함수들을 useCallback으로 메모이제이션
  const handleImageClear = useCallback(() => {
    clearImage();
    setImagePreviewUrl(null);
    setFormData((prev) => ({ ...prev, image: null }));
  }, [clearImage, setImagePreviewUrl, setFormData]);

  const handlePreviewUrlClear = useCallback(() => {
    setImagePreviewUrl(null);
    setFormData((prev) => ({ ...prev, image: null }));
  }, [setImagePreviewUrl, setFormData]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEmotionId) {
      toastUtils.error({ title: '실패', message: '감정을 선택해 주세요' });
      scrollToElement(emotionSectionRef.current);
      return;
    }

    if (!formData.title.trim()) {
      toastUtils.error({ title: '실패', message: '제목을 입력해 주세요' });
      titleRef.current?.focus();
      scrollToElement(titleRef.current);
      return;
    }

    if (!formData.content.trim()) {
      toastUtils.error({ title: '실패', message: '내용을 입력해 주세요' });
      contentRef.current?.focus();
      scrollToElement(contentRef.current);
      return;
    }

    if (!user?.id) {
      toastUtils.error({
        title: '실패',
        message: '사용자 정보가 없습니다. 다시 로그인 후 시도해 주세요.',
      });
      return;
    }

    try {
      let imageUrl: string | null = null;

      if (imageFile) {
        const uploadedUrl = await uploadImageToStorage(imageFile, user.id);
        if (!uploadedUrl) return;
        imageUrl = uploadedUrl;
      } else if (imagePreviewUrl && imagePreviewUrl.trim() !== '') {
        imageUrl = imagePreviewUrl;
      }

      let diaryData = null;

      if (existingDiary?.id) {
        // 수정 모드
        const { data, error } = await supabase
          .from('diaries')
          .update({
            emotion_main_id: selectedEmotionId,
            title: formData.title,
            content: formData.content,
            is_public: formData.isPublic,
            diary_image: imageUrl,
          })
          .eq('id', existingDiary.id)
          .select('id')
          .single();

        if (error) throw error;
        diaryData = data;

        await supabase.from('diary_hashtags').delete().eq('diary_id', existingDiary.id);
      } else {
        // 신규 작성 모드 - 새벽 시간대 고려한 처리
        const selectedDateObj = new Date(diaryDate);
        const now = new Date();

        // 선택된 날짜의 년, 월, 일 추출
        const selectedYear = selectedDateObj.getFullYear();
        const selectedMonth = selectedDateObj.getMonth();
        const selectedDay = selectedDateObj.getDate();

        let createdAtUTC: Date;

        if (now.getHours() >= 0 && now.getHours() < 6) {
          // 새벽 0~6시는 정오(12시)로 설정하여 날짜 꼬임 방지
          const createdAtKST = new Date(selectedYear, selectedMonth, selectedDay, 12, 0, 0, 0);
          createdAtUTC = new Date(createdAtKST.getTime() - 9 * 60 * 60 * 1000);
        } else {
          // 그 외 시간은 현재 시간 사용
          const createdAtKST = new Date(
            selectedYear,
            selectedMonth,
            selectedDay,
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
            now.getMilliseconds(),
          );
          createdAtUTC = new Date(createdAtKST.getTime() - 9 * 60 * 60 * 1000);
        }

        const { data, error } = await supabase
          .from('diaries')
          .insert([
            {
              user_id: user.id,
              emotion_main_id: selectedEmotionId,
              title: formData.title,
              content: formData.content,
              is_public: formData.isPublic,
              diary_image: imageUrl,
              created_at: createdAtUTC.toISOString(),
              is_drafted: false,
            },
          ])
          .select('id')
          .single();

        if (error) throw error;
        diaryData = data;
      }

      // 해시태그 처리
      if (tags.length > 0 && diaryData) {
        const hashtagIds = await processHashtags(tags);

        if (hashtagIds.length > 0) {
          const diaryHashtagsData = hashtagIds.map((hashtagId) => ({
            diary_id: diaryData.id,
            hashtag_id: hashtagId,
          }));

          const { error: hashtagError } = await supabase
            .from('diary_hashtags')
            .insert(diaryHashtagsData);

          if (hashtagError) {
            toastUtils.error({
              title: '경고',
              message: '일기는 저장되었으나 일부 해시태그 처리에 실패했습니다.',
            });
          }
        }
      }

      clearDraft();

      toastUtils.success({ title: '성공', message: '일기가 저장되었습니다.' });
      navigate('/diary');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '일기 저장 중 오류가 발생했습니다.';
      toastUtils.error({ title: '실패', message: '일기 저장 중 오류가 발생했습니다.' });
      console.error('일기 저장 중 오류:', errorMessage);
    }
  };

  if (isLoadingEmotions) {
    return (
      <main className={S.container}>
        <Spinner />
      </main>
    );
  }

  return (
    <main className={S.container}>
      <DiaryWeather />
      <div className={S.inner}>
        <form onSubmit={onSubmit}>
          <h3 className={S.pageTitle}>{isEditMode ? '씨앗 기록 수정' : '새로운 씨앗 기록'}</h3>
          <div className={S.formArea}>
            <EmotionSelector
              ref={emotionSectionRef}
              emotions={emotions}
              selectedEmotionId={selectedEmotionId}
              onEmotionSelect={(id) => handleEmotionSelect(id, emotions)}
            />

            {/* 제목 */}
            <div>
              <label htmlFor={titleId} className={S.itemTitle}>
                제목<span className={S.required}></span>
              </label>
              <input
                type="text"
                className={S.customInput}
                id={titleId}
                name="title"
                value={formData.title}
                placeholder="제목을 입력해 주세요"
                onChange={handleInputChange}
                ref={titleRef}
              />
            </div>

            {/* 내용 */}
            <div>
              <label htmlFor={contentId} className={S.itemTitle}>
                내용<span className={S.required}></span>
              </label>
              <textarea
                id={contentId}
                className={S.customTextarea}
                name="content"
                value={formData.content}
                placeholder="내용을 입력해 주세요"
                rows={17}
                onChange={handleInputChange}
                ref={contentRef}
              />
            </div>

            {/* 공개 설정 */}
            <div>
              <label className={S.itemTitle}>
                공개 설정<span className={S.required}></span>
              </label>
              <div className={S.radioArea}>
                <label>
                  <input
                    type="radio"
                    name="publicSetting"
                    value="public"
                    checked={selected === 'public'}
                    onChange={handleChange}
                  />
                  {selected === 'public' ? (
                    <BsCheckSquareFill className={S.active} size={24} />
                  ) : (
                    <BsCheckSquare className={S.unactive} size={24} />
                  )}
                  <span>공개</span>
                </label>

                <label>
                  <input
                    type="radio"
                    name="publicSetting"
                    value="private"
                    checked={selected === 'private'}
                    onChange={handleChange}
                  />
                  {selected === 'private' ? (
                    <BsCheckSquareFill className={S.active} size={24} />
                  ) : (
                    <BsCheckSquare className={S.unactive} size={24} />
                  )}
                  <span>비공개</span>
                </label>
              </div>
            </div>

            <ImageUpload
              imageId={imageId}
              imageFile={imageFile}
              imagePreview={imagePreview}
              imagePreviewUrl={imagePreviewUrl}
              onImageChange={handleImageChange}
              onClearImage={handleImageClear}
              onClearPreviewUrl={handlePreviewUrlClear}
            />

            {/* 태그 */}
            <div>
              <label htmlFor={tagId} className={S.itemTitle}>
                태그
              </label>
              <input
                type="text"
                className={S.customInput}
                id={tagId}
                value={tagInput}
                placeholder="#태그 형식으로 입력해주세요 (예: #일상 #행복 #여행)"
                onChange={(e) => handleTagChange(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
              />

              {tags.length > 0 && (
                <div className={S.tagDisplay}>
                  {tags.map((tag, index) => (
                    <span key={index} className={S.tagItem}>
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(index)}
                        className={S.removeTag}
                        aria-label={`${tag} 태그 제거`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={S.buttonGroup}>
            <button type="button" className={S.bgGrayBtn} onClick={handleCancel}>
              취소
            </button>
            <button type="button" className={S.lineBtn} onClick={handleSaveDraft}>
              임시 저장
            </button>
            <button type="submit" className={S.bgPrimaryBtn}>
              저장
            </button>
          </div>
        </form>
      </div>

      {showCancelModal && (
        <ConfirmModal
          title="작성 취소"
          message="저장하지 않은 변경사항이 있습니다. 정말 나가시겠습니까?"
          onConfirm={handleCancelConfirm}
          onCancel={handleCancelModalCancel}
          confirmText="나가기"
          cancelText="계속 작성"
        />
      )}
      {showRestoreDialog && (
        <ConfirmModal
          title="임시저장 복원"
          message="이전에 임시저장된 내용이 있습니다. 불러오시겠습니까?"
          onConfirm={handleRestoreConfirm}
          onCancel={handleRestoreCancel}
          confirmText="예"
          cancelText="아니오"
        />
      )}
    </main>
  );
};

export default DiaryFormPage;
