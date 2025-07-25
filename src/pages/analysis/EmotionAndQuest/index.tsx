import { useEffect, useState } from 'react';
import { diaries, emotionMains, emotionSubs, quests } from '../dummyData'
import S from './style.module.css'

function EmotionAndQuest() {

  const diary = diaries[0];
  const mainEmotion = emotionMains.find((e) => e.id === diary.emotion_main_id); // 대감정 표시할지? 표시하면 선택한 일기 옆에 넣을지, 감정 선택하는 곳 옆에 넣을지
  const subEmotion = emotionSubs.filter((e) => e.emotion_main_id === diary.emotion_main_id);
  const quest = quests.filter((e) => e.emotion_main_id === diary.emotion_main_id);

  const [selectedSubs, setSelectedSubs] = useState<number[]>([])
  const [questAccepted, setQuestAccepted] = useState<boolean | null>(null);
  const [selectedQuests, setSelectedQuests] = useState<number[]>([]);

  // 감정 소분류 토글
  const toggleSub = (id: number) => {
    setSelectedSubs((prev) => {
      const updated = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      return updated.sort((a, b) => a - b)
    });
  };

  // 퀘스트 선택 토글
  const toggleQuest = (id: number) => {
    setSelectedQuests((prev) => {
      const updated = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      return updated.sort((a, b) => a - b)
    });
  };

  // 감정 로그 찍는 용
  useEffect(() => {
    console.log('현재 선택된 감정 ID:', selectedSubs);
  }, [selectedSubs]);

  useEffect(() => {
    console.log('현재 선택된 퀘스트 ID:', selectedQuests);
  }, [selectedQuests]);

  // 스크롤 내려주기
  useEffect(() => {
    if (questAccepted === true) {
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth',
        });
      }, 200);
    }
  }, [questAccepted]);


  return (
    <main className={S.container}>
      <section aria-label='선택한 일기 보기' className={S.diarySection}>
        <h3>내가 선택한 일기</h3>
        <div className={S.diaryBox}>
          <p className={S.content}>{diary.content}</p>
        </div>
      </section>

      <section aria-label='감정 선택 영역' className={S.emotionSection}>
        <h3>당시 느꼈던 감정들을 자유롭게 선택해보세요</h3>
        <ul className={S.emotionList}>
          {subEmotion.map((emotion) => (
            <li key={emotion.id}>
              <button
                type="button"
                className={`${S.subEmotionBtn} ${selectedSubs.includes(emotion.id) ? S.selected : ''}`}
                onClick={() => toggleSub(emotion.id)}
              >
                {emotion.name}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label='감정 이유 입력' className={S.reasonSection}>
        <h3>지금 떠오르는 이유를 솔직하게 적어보세요</h3>
        <textarea name="감정 이유" id="" className={S.emotionReason}></textarea>
      </section>

      {questAccepted === null && (
        <section aria-label='퀘스트 수락 여부 선택' className={S.decisionSection}>
          <h3>추천 퀘스트를 받아보시겠어요?</h3>
          <div className={S.buttons}>
            <button type="button" className={S.reject} onClick={() => setQuestAccepted(false)}>괜찮아요</button>
            <button type="button" className={S.accept} onClick={() => setQuestAccepted(true)}>좋아요</button>
          </div>
        </section>
      )}

      {questAccepted === false && (
        <section aria-label='작성 완료 여부 선택' className={S.submitSection}>
            <button type="button" className={S.submit}>완료</button>
        </section>
      )}

      {questAccepted === true && (
        <>
          <section aria-label='퀘스트 선택' className={S.questSection}>
            <h3>원하는 퀘스트를 선택해주세요.</h3>
            <ul className={S.questList}>
              {quest.map((q) => (
                <li key={q.id}>
                  <article className={S.questCard}>
                    <img src={q.image_url} alt="퀘스트 사진" />
                    <div className={S.cardContent}>
                      <h4>{q.title}</h4>
                      <p>{q.content}</p>
                    </div>
                      {/* <button className={S.cardButton}>선택</button> */}
                      <button
                        type="button"
                        className={`${S.cardButton} ${selectedQuests.includes(q.id) ? S.selected : ''}`}
                        onClick={() => toggleQuest(q.id)}
                      >
                        {selectedQuests.includes(q.id) ? '해제' : '선택'}
                      </button>
                  </article>
                </li>
              ))}
            </ul>
          </section>
          <section aria-label='작성 완료 여부 선택' className={S.submitSection}>
              <button type="button" className={S.submit}>완료</button>
          </section>
        </>
      )}


    </main>
  )
}
export default EmotionAndQuest