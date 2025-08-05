// src/pages/DiaryDetail/components/AnalysisResult.tsx

import { useDiaryAnalysis } from '../../hooks/useDiaryAnalysis';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { useState } from 'react';
import S from './style.module.css';

interface Props {
  diaryId: string;
  isAuthor: boolean;
}

function AnalysisResult({ diaryId, isAuthor }: Props) {
  const { analysis, loading } = useDiaryAnalysis(diaryId);
  const [isOpen, setIsOpen] = useState(false);

  if (loading || !analysis) return null; // 로딩 중이거나 감정 분석 안 했으면 렌더 x
  if (!isAuthor && !analysis.is_public) return null; // 작성자가 아니고 비공개면 렌더 x

  const hasAIAnalysis =
    analysis.empathy &&
    analysis.emotionalTriggers &&
    analysis.emotionInterpretation &&
    analysis.reminderMessage &&
    analysis.selfReflectionSuggestion;

  return (
    <div className={S.divider}>
      <div className={S.container}>
        <button className={S.header} onClick={() => setIsOpen((prev) => !prev)}>
          <div className={S.headerLeft}>
            <img
              src="https://cwfprztpicrpmlfmuemw.supabase.co/storage/v1/object/public/assets/stamp-small.svg"
              alt="감정 분석 완료 도장"
            />
            <span>감정 분석 결과</span>
          </div>
          {isOpen ? <IoChevronUp size={24} /> : <IoChevronDown size={24} />}
        </button>

        {isOpen && (
          <div className={S.analysisResult}>
            <section className={S.selfSection}>
              <h4>내가 기록한 감정과 이유</h4>
              <div className={S.analysisBox}>
                <div className={S.analysisItem}>
                  <p>[내가 느낀 감정들]</p>
                  <div className={S.emotions}>
                    {analysis.emotions.map((emotion) => (
                      <span key={emotion.id} className={S.emotionTag}>
                        {emotion.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={S.analysisItem}>
                  <p>[그렇게 느낀 이유]</p>
                  <span>{analysis.reason}</span>
                </div>
              </div>
            </section>

            {hasAIAnalysis && (
              <section className={S.aiSection}>
                <h4>몰리의 감정 분석 결과</h4>
                <div className={S.analysisBox}>
                  <p className={S.empathy}>{analysis.empathy}</p>
                  <div className={S.analysisItem}>
                    <p>[감정 유발 요인]</p>
                    <span>{analysis.emotionalTriggers}</span>
                  </div>
                  <div className={S.analysisItem}>
                    <p>[감정 해석]</p>
                    <span>{analysis.emotionInterpretation}</span>
                  </div>
                  <div className={S.analysisItem}>
                    <p>[리마인드]</p>
                    <span>{analysis.reminderMessage}</span>
                  </div>
                  <div className={S.analysisItem}>
                    <p>[자기성찰]</p>
                    <span>{analysis.selfReflectionSuggestion}</span>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default AnalysisResult;
