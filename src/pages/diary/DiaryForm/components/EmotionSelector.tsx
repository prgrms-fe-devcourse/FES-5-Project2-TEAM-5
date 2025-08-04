import { forwardRef } from 'react';
import S from '../style.module.css';
import type { EmotionMain } from '@/shared/types/diary';

interface Props {
  emotions: EmotionMain[];
  selectedEmotionId: number | null;
  onEmotionSelect: (id: number) => void;
}

export const EmotionSelector = forwardRef<HTMLDivElement, Props>(
  ({ emotions, selectedEmotionId, onEmotionSelect }, ref) => {
    return (
      <div ref={ref}>
        <label className={S.itemTitle}>
          오늘의 감정 씨앗을 선택해 주세요<span className={S.required}></span>
        </label>
        <div className={S.emotionGroup}>
          {emotions.map((emotion) => (
            <button
              key={emotion.id}
              type="button"
              onClick={() => onEmotionSelect(emotion.id)}
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
    );
  },
);

EmotionSelector.displayName = 'EmotionSelector';
