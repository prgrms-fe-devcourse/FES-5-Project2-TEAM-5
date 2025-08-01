// src/pages/DiaryDetail/components/AnalysisResult.tsx

import { useDiaryAnalysis } from '../../hooks/useDiaryAnalysis';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { useState } from 'react';
import S from './style.module.css';

interface Props {
  diaryId: string;
}

function AnalysisResult({ diaryId }: Props) {
  const { analysis, loading } = useDiaryAnalysis(diaryId);
  const [isOpen, setIsOpen] = useState(false);

  if (loading || !analysis) return null; // 로딩 중이거나 감정 분석 안 했으면 렌더 x

  return (
    <div className={S.container}>
      <button className={S.header} onClick={() => setIsOpen((prev) => !prev)}>
        <div className={S.headerLeft}>
          <img src="https://ttqedeydfvolnyrivpvg.supabase.co/storage/v1/object/public/assets//stamp-small.svg" alt="감정 분석 완료 도장" />
          <span>감정 분석 결과</span>
        </div>
        {isOpen ? <IoChevronUp size={24} /> : <IoChevronDown size={24} />}
      </button>

      {isOpen && (
        <div className={S.analysisResult}>
          <section className={S.emotionSection}>
            <h4>감정</h4>
            <div className={S.emotions}>
              {analysis.emotions.map((emotion) => (
                <span key={emotion.id} className={S.emotionTag}>
                  {emotion.name}
                </span>
              ))}
            </div>
          </section>

          <section className={S.reasonSection}>
            <h4>이유</h4>
            <p>{analysis.reason}</p>
          </section>
        </div>
      )}
    </div>
  );
}
export default AnalysisResult