// import Buttons from './components/Buttons';
// import DiaryList from './components/DiaryList';
import { GrFormCheckmark, GrFormNextLink } from "react-icons/gr";
import S from './style.module.css'

function SelectDiary() {

  const diaries = [
    {
      id: 1,
      date: '2023년 10월 28일',
      title: '코딩 부트캠프 첫 날, 설렘과 긴장 사이',
      content: '드디어 기다리던 코딩 부트캠프가 시작되었다. 새로운 사람들과 새로운 환경에 대한 설렘도 잠시, 앞으로의 과정이 얼마나 험난할지에 대한 걱정과 긴장감이 밀려왔다. 첫 수업은 파이썬 기초였는데, 생각보다 따라가기 어렵지 않아서 다행…'
    },
    {
      id: 2,
      date: '2023년 10월 27일',
      title: '오랜만에 만난 친구와 즐거운 수다',
      content: '고등학교 친구를 정말 오랜만에 만났다. 카페에 앉아 시간 가는 줄 모르고 수다를 떨었다. 서로의 근황을 나누고, 옛날 추억을 이야기하며 한참을 웃었다. 역시 오랜 친구는 언제 만나도 편하고 즐겁다.'
    },
    {
      id: 3,
      date: '2023년 10월 26일',
      title: '가을 산책, 그리고 뜻밖의 발견',
      content: '날씨가 너무 좋아서 집 근처 공원으로 산책을 나갔다. 울긋불긋한 단풍이 정말 아름다웠다. 한참을 걷다가 우연히 작은 책방을 발견했다. 아기자기하게 꾸며진 공간이 마음에 쏙 들어 한참을 구경하다가 마음에 드는 책 한 권을 사서 나왔다.'
    }
  ];
  
  return (
    <main className={S.container}>
      <section aria-label='일기 선택 안내' className={S.intro}>
        <h2>일기 선택</h2>
        <p>감정분석을 하고 싶은 일기를 선택해주세요.</p>
      </section>

      <section aria-label='일기 목록' className={S.diaryList}>
        {
          diaries.map((diary)=>(
            <label key={diary.id} htmlFor={`diary-${diary.id}`} className={S.diaryItem}>
              <input type="radio" name="diary" id={`diary-${diary.id}`} className={S.radioBtn} />
              <GrFormCheckmark className={S.checkIcon} />
              <div className={S.textContent}>
                <p className={S.date}>{diary.date}</p>
                <h3>{diary.title}</h3>
                <p className={S.content}>{diary.content}</p>
              </div>
            </label>
          ))
        }
        <button type='button' className={S.loadMore}>이전 일기 불러오기</button>
      </section>

      <section aria-label='페이지 이동' className={S.nextPage}>
        <button type="button">다음으로
          <GrFormNextLink className={S.nextIcon} size={28} />
        </button>
      </section>
    </main>
  )
}
export default SelectDiary