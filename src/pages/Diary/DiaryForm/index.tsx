import S from './style.module.css';
import { useEffect, useId, useRef, useState } from 'react';
import { useUploadImage } from '@/shared/hooks';
import { BsCheckSquare, BsCheckSquareFill } from 'react-icons/bs';
import { CgClose } from 'react-icons/cg';
import DiaryWeather from '@/shared/components/DiaryWeather';
import supabase from '@/shared/api/supabase/client';
import { useLocation, useNavigate } from 'react-router-dom';
import { toastUtils } from '@/shared/components/Toast';
import { useUserContext } from '@/shared/context/UserContext';

interface EmotionMain {
  id: number;
  name: string;
  icon_url: string;
}

interface Props {
  emotion: string;
  title: string;
  content: string;
  isPublic: boolean;
  image?: File | null;
  tags?: string[];
}

const DiaryFormPage = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [diaryDate, setDiaryDate] = useState<string>(
    () => location.state?.date ?? new Date().toISOString().split('T')[0],
  );

  const titleId = useId();
  const contentId = useId();
  const imageId = useId();
  const tagId = useId();

  // ref 추가 - 감정 선택 영역과 기존 필드들
  const emotionSectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const { onChange: handleImageChange, imageFile } = useUploadImage();

  const [formData, setFormData] = useState<Props>({
    emotion: '',
    title: '',
    content: '',
    isPublic: true,
    image: null,
    tags: [],
  });

  const [selected, setSelected] = useState<'public' | 'private'>('public');
  const [selectedEmotionId, setSelectedEmotionId] = useState<number | null>(null);
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);

  const [emotions, setEmotions] = useState<EmotionMain[]>([]);
  const [isLoadingEmotions, setIsLoadingEmotions] = useState(true);

  // 스크롤 이동 헬퍼 함수
  const scrollToElement = (element: HTMLElement | null) => {
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  };

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        const { data, error } = await supabase
          .from('emotion_mains')
          .select('id, name, icon_url')
          .order('id');

        if (error) {
          console.error('감정 데이터 로드 실패:', error);
          toastUtils.error({ title: '실패', message: '감정 데이터를 불러오는데 실패했습니다.' });
          return;
        }

        setEmotions(data || []);
      } catch (error) {
        console.error('감정 데이터 로드 중 오류:', error);
        toastUtils.error({ title: '실패', message: '감정 데이터를 불러오는데 실패했습니다.' });
      } finally {
        setIsLoadingEmotions(false);
      }
    };

    fetchEmotions();
  }, []);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      image: imageFile,
    }));
  }, [imageFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as 'public' | 'private';
    setSelected(value);
    setFormData((prev) => ({
      ...prev,
      isPublic: value === 'public',
    }));
  };

  const handleEmotionSelect = (id: number) => {
    setSelectedEmotionId((prev) => (prev === id ? null : id));
    const emotionName = emotions.find((emo) => emo.id === id)?.name || '';
    setFormData((prev) => ({ ...prev, emotion: emotionName }));
  };

  const uploadImageToStorage = async (file: File) => {
    if (!user?.id) {
      toastUtils.error({
        title: '실패',
        message: '사용자 정보가 없습니다. 다시 로그인 해 주세요.',
      });
      return null;
    }

    const bucketName = 'diary-image';
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage.from(bucketName).upload(fileName, file);

    if (error) {
      console.error('이미지 업로드 실패', error.message);

      if (error.message.includes('Bucket not found')) {
        toastUtils.error({
          title: '설정 오류',
          message: 'Supabase Storage 버킷이 생성되지 않았습니다. 관리자에게 문의하세요.',
        });
      } else {
        toastUtils.error({ title: '실패', message: '이미지 업로드에 실패했습니다.' });
      }
      return null;
    }

    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(data.path);
    return publicUrlData.publicUrl;
  };

  const processHashtags = async (tagStrings: string[]) => {
    if (tagStrings.length === 0) return [];

    const tagNames = tagStrings.map((tag) => (tag.startsWith('#') ? tag.slice(1) : tag));
    const hashtagIds: string[] = [];

    for (const tagName of tagNames) {
      try {
        const { data: existingTag, error: selectError } = await supabase
          .from('hashtags')
          .select('id')
          .eq('name', tagName)
          .single();

        if (selectError && selectError.code !== 'PGRST116') {
          console.error('해시태그 조회 실패:', selectError);
          continue;
        }

        if (existingTag) {
          hashtagIds.push(existingTag.id);
        } else {
          const { data: newTag, error: insertError } = await supabase
            .from('hashtags')
            .insert({ name: tagName })
            .select('id')
            .single();

          if (insertError) {
            console.error('해시태그 생성 실패:', insertError);
            continue;
          }

          if (newTag) {
            hashtagIds.push(newTag.id);
          }
        }
      } catch (error) {
        console.error('해시태그 처리 중 오류:', error);
      }
    }

    return hashtagIds;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 감정 선택 체크 및 스크롤 이동
    if (!selectedEmotionId) {
      toastUtils.error({ title: '실패', message: '감정을 선택해 주세요' });
      scrollToElement(emotionSectionRef.current);
      return;
    }

    // 제목 체크 및 스크롤 이동
    if (!formData.title.trim()) {
      toastUtils.error({ title: '실패', message: '제목을 입력해 주세요' });
      titleRef.current?.focus();
      scrollToElement(titleRef.current);
      return;
    }

    // 내용 체크 및 스크롤 이동
    if (!formData.content.trim()) {
      toastUtils.error({ title: '실패', message: '내용을 입력해 주세요' });
      contentRef.current?.focus();
      scrollToElement(contentRef.current);
      return;
    }

    if (!user || !user.id) {
      toastUtils.error({
        title: '실패',
        message: '사용자 정보가 없습니다. 다시 로그인 후 시도해 주세요.',
      });
      return;
    }

    try {
      // 이미지 업로드
      let imageUrl = '';
      if (formData.image) {
        const uploadedUrl = await uploadImageToStorage(formData.image as File);
        if (!uploadedUrl) {
          toastUtils.error({ title: '실패', message: '이미지 업로드에 실패했습니다.' });
          return;
        }
        imageUrl = uploadedUrl;
      }

      // 날짜 처리
      const selectedLocalDay = new Date(diaryDate);
      selectedLocalDay.setHours(0, 0, 0, 0);
      const createdAtISOString = selectedLocalDay.toISOString();

      // 일기 저장
      const { data: diaryData, error: diaryError } = await supabase
        .from('diaries')
        .insert([
          {
            user_id: user.id,
            emotion_main_id: selectedEmotionId,
            title: formData.title,
            content: formData.content,
            is_public: formData.isPublic,
            diary_image: imageUrl,
            created_at: createdAtISOString,
            is_drafted: false,
          },
        ])
        .select('id')
        .single();

      if (diaryError) {
        console.error('일기 저장 에러:', diaryError);
        toastUtils.error({ title: '실패', message: '일기 저장에 실패했습니다.' });
        return;
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
            console.error('해시태그 연결 실패:', hashtagError);
            toastUtils.error({
              title: '경고',
              message: '일기는 저장되었으나 일부 해시태그 처리에 실패했습니다.',
            });
          }
        }
      }

      toastUtils.success({ title: '성공', message: '일기가 저장되었습니다.' });
      navigate('/diary');
    } catch (error) {
      console.error('일기 저장 중 오류:', error);
      toastUtils.error({ title: '실패', message: '일기 저장 중 오류가 발생했습니다.' });
    }
  };

  // 로딩 상태 처리
  if (isLoadingEmotions) {
    return (
      <main className={S.container}>
        <DiaryWeather />
        <div className={S.inner}>
          <span className={S.spinner}></span>
        </div>
      </main>
    );
  }

  return (
    <main className={S.container}>
      <DiaryWeather />
      <div className={S.inner}>
        <h3 className={S.pageTitle}>새로운 씨앗 기록</h3>
        <form onSubmit={handleSubmit}>
          <div className={S.formArea}>
            {/* 감정 선택 - ref 추가 */}
            <div ref={emotionSectionRef}>
              <label className={S.itemTitle}>
                오늘의 감정 씨앗을 선택해 주세요<span className={S.required}></span>
              </label>
              <div className={S.emotionGroup}>
                {emotions.map((emotion) => (
                  <button
                    key={emotion.id}
                    type="button"
                    onClick={() => handleEmotionSelect(emotion.id)}
                    className={selectedEmotionId === emotion.id ? S.active : ''}
                  >
                    <img
                      src={emotion.icon_url}
                      alt={emotion.name}
                      width={18}
                      height={20}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    {emotion.name}
                  </button>
                ))}
              </div>
            </div>

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

            {/* 이미지 업로드 */}
            <div>
              <label htmlFor={imageId} className={S.itemTitle}>
                이미지
              </label>
              <div className={S.fileAttachBox}>
                <input
                  type="file"
                  accept="image/*"
                  id={imageId}
                  className="sr-only"
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById(imageId)?.click()}
                  className={S.uploadButton}
                >
                  이미지 첨부
                </button>
                {!formData.image && <p className={S.placeholderText}>이미지를 첨부해 주세요</p>}
                {formData.image && (
                  <div className={S.fileInfo}>
                    <p className={S.fileName}>{(formData.image as File).name}</p>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          image: null,
                        }))
                      }
                      className={S.deleteButton}
                    >
                      <CgClose className={S.deleteIcon} size={24} />
                    </button>
                  </div>
                )}
              </div>
            </div>

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
                onChange={(e) => {
                  const value = e.target.value;
                  setTagInput(value);

                  const parsedTags = value
                    .split(' ')
                    .map((tag) => tag.trim())
                    .filter((tag) => tag.startsWith('#') && tag.length > 1);

                  setTags(parsedTags);
                  setFormData((prev) => ({ ...prev, tags: parsedTags }));
                }}
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className={S.buttonGroup}>
            <button type="button" className={S.bgGrayBtn} onClick={() => navigate(-1)}>
              취소
            </button>
            <button type="submit" className={S.bgPrimaryBtn}>
              저장
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default DiaryFormPage;
