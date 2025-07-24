

// 다이어리
export const diaries = [
  {
    id: 1,
    date: '2023년 10월 28일',
    title: '코딩 부트캠프 첫 날, 설렘과 긴장 사이',
    content: '드디어 기다리던 코딩 부트캠프가 시작되었다. 새로운 사람들과 새로운 환경에 대한 설렘도 잠시, 앞으로의 과정이 얼마나 험난할지에 대한 걱정과 긴장감이 밀려왔다. 첫 수업은 파이썬 기초였는데, 생각보다 따라가기 어렵지 않아서 다행…',
    emotion_main_id: 3,
  },
  {
    id: 2,
    date: '2023년 10월 27일',
    title: '오랜만에 만난 친구와 즐거운 수다',
    content: '고등학교 친구를 정말 오랜만에 만났다. 카페에 앉아 시간 가는 줄 모르고 수다를 떨었다. 서로의 근황을 나누고, 옛날 추억을 이야기하며 한참을 웃었다. 역시 오랜 친구는 언제 만나도 편하고 즐겁다.',
    emotion_main_id: 3,
  },
  {
    id: 3,
    date: '2023년 10월 26일',
    title: '가을 산책, 그리고 뜻밖의 발견',
    content: '날씨가 너무 좋아서 집 근처 공원으로 산책을 나갔다. 울긋불긋한 단풍이 정말 아름다웠다. 한참을 걷다가 우연히 작은 책방을 발견했다. 아기자기하게 꾸며진 공간이 마음에 쏙 들어 한참을 구경하다가 마음에 드는 책 한 권을 사서 나왔다.',
    emotion_main_id: 3,
  }
];

// 대분류 감정
export const emotionMains = [
  { id: 1, name: "행복" },
  { id: 2, name: "슬픔" },
  { id: 3, name: "분노" },
  { id: 4, name: "두려움" },
  { id: 5, name: "놀람" },
];

// 소분류 감정 (대분류와 연결)
export const emotionSubs = [
  { id: 1, emotion_main_id: 1, name: "기쁨" },
  { id: 2, emotion_main_id: 1, name: "만족" },
  { id: 3, emotion_main_id: 2, name: "우울" },
  { id: 4, emotion_main_id: 2, name: "실망" },
  { id: 5, emotion_main_id: 3, name: "짜증나는" },
  { id: 6, emotion_main_id: 3, name: "답답한" },
  { id: 7, emotion_main_id: 3, name: "억울한" },
  { id: 8, emotion_main_id: 3, name: "화나는" },
  { id: 9, emotion_main_id: 3, name: "폭발하는" },
  { id: 10, emotion_main_id: 4, name: "불안" },
  { id: 11, emotion_main_id: 4, name: "공포" },
  { id: 12, emotion_main_id: 5, name: "경악" },
];