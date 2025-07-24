import S from './style.module.css';
import DiaryWeather from '../DiaryMain/components/DiaryWeather';
import Emotion1 from '/src/assets/icon_joy.svg';
import Emotion2 from '/src/assets/icon_sad.svg';
import Emotion3 from '/src/assets/icon_anger.svg';
import Emotion4 from '/src/assets/icon_anxiety.svg';
import Emotion5 from '/src/assets/icon_surprise.svg';
import Emotion6 from '/src/assets/icon_peace.svg';
import Emotion7 from '/src/assets/icon_expect.svg';
import { useId, useState } from 'react';
import { GrCheckbox, GrCheckboxSelected } from 'react-icons/gr';

interface Props {
  emotion: string;
  title: string;
  content: string;
  isPublic: boolean;
  image?: File | null;
  tags?: string[];
}

function DiaryFormPage() {
  const titleId = useId();
  const contentId = useId();
  const imageId = useId();
  const tagId = useId();

  const [formData, setFormData] = useState<Props>({
    emotion: '',
    title: '',
    content: '',
    isPublic: true,
    image: null,
    tags: [],
  });

  const emotions = [
    { id: 1, label: '기쁨', icon: Emotion1 },
    { id: 2, label: '슬픔', icon: Emotion2 },
    { id: 3, label: '화남', icon: Emotion3 },
    { id: 4, label: '불안', icon: Emotion4 },
    { id: 5, label: '놀람', icon: Emotion5 },
    { id: 6, label: '평온', icon: Emotion6 },
    { id: 7, label: '기대', icon: Emotion7 },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [selected, setSelected] = useState<string>('public');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.value);
  };

  const [selectedEmotionId, setSelectedEmotionId] = useState<number | null>(null);

  const handleEmotionSelect = (id: number) => {
    setSelectedEmotionId((prev) => (prev === id ? null : id));
  };

  return (
    <main className={S.container}>
      <DiaryWeather />
      <div className={S.inner}>
        <h3 className={S.pageTitle}>새로운 씨앗 기록</h3>
        <form>
          <div className={S.formArea}>
            {/* 감정 선택 */}
            <div>
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
                    <img src={emotion.icon} alt={emotion.label} width={18} height={20} />
                    {emotion.label}
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
                id={titleId}
                name="title"
                value={formData.title}
                placeholder="제목을 입력해 주세요"
                onChange={handleInputChange}
                required
              />
            </div>

            {/* 내용 */}
            <div>
              <label htmlFor={contentId} className={S.itemTitle}>
                내용<span className={S.required}></span>
              </label>
              <textarea
                id={contentId}
                name="content"
                value={formData.content}
                placeholder="내용을 입력해 주세요"
                rows={17}
                onChange={handleInputChange}
                required
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
                    <GrCheckboxSelected className={S.active} />
                  ) : (
                    <GrCheckbox className={S.unactive} />
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
                    <GrCheckboxSelected className={S.active} />
                  ) : (
                    <GrCheckbox className={S.unactive} />
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
              <div className="">
                <input type="file" accept="image/*" id={imageId} className="sr-only" />
                <button
                  type="button"
                  onClick={() => document.getElementById(imageId)?.click()}
                  className={S.uploadButton}
                >
                  이미지 첨부
                </button>
              </div>
            </div>

            {/* 태그 */}
            <div>
              <label htmlFor={tagId} className={S.itemTitle}>
                태그
              </label>
              <input
                type="text"
                id={tagId}
                placeholder="태그를 입력해 주세요"
                onChange={handleChange}
              />
            </div>
          </div>
        </form>

        {/* 버튼 */}
        <div className={S.buttonGroup}>
          <button type="button" className={S.cancel}>
            취소
          </button>
          <button type="submit" className={S.temporary}>
            임시 저장
          </button>
          <button type="submit" className={S.save}>
            저장
          </button>
        </div>
      </div>
    </main>
  );
}

export default DiaryFormPage;
