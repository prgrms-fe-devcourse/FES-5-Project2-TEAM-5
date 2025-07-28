import S from './style.module.css';
import DiaryCard from './components/DiaryCard';
import Masonry from 'react-masonry-css';
import EmotionSelectBox from './components/EmotionSelectBox';
import SearchBox from './components/SearchBox';
import joyImg from './assets/joy.png';
import sadnessImg from './assets/sadness.png';
import angerImg from './assets/anger.png';
import anxietyImg from './assets/anxiety.png';
import surpriseImg from './assets/surprise.png';
import peaceImg from './assets/peace.png';
import expectationImg from './assets/expectation.png';
import { useCallback, useState } from 'react';
import { useDiariesSearch } from './hooks/useDiarySearch';
import type { Emotion } from './type/emotion';

// 임시데이터
const diaries = [
  {
    id: 'f3a2a2d4-bb6a-4433-9a12-1b1b36c60c77',
    user_id: '9d5b49f6-38b4-42fa-b3a3-07f38d18444c',
    title: '봄날의 산책',
    content:
      '오늘은 날씨가 너무 좋아서 근처 공원을 한참 걸었다. 따뜻한 햇살을 느끼며 마음속 깊은 곳까지 평온함이 스며드는 걸 느꼈다.',
    diary_image: 'https://picsum.photos/seed/diary1/600/400',
    emotion_main_id: 2,
    is_public: true,
    created_at: '2025-07-20T09:15:00Z',
    updated_at: '2025-07-20T09:15:00Z',
    is_drafted: false,
  },
  {
    id: 'a1b3c6d7-8e9f-4b23-bcc3-1e2f3a456789',
    user_id: '92fd8a74-1b11-4122-a6ea-2f2122e7239c',
    title: '불안했던 하루',
    content:
      '오늘 중요한 회의가 있었는데, 생각만큼 내 의견을 잘 전달하지 못했다. 말문이 막히고 긴장감에 사로잡혀, 내 자신에게 답답함이 밀려왔다. 왜 나는 늘 이런 상황에서 자신감을 잃는 걸까? 마음속 깊이 자리 잡은 불안감이 나를 힘들게 하는 것 같다. 하지만 다시 한번 준비해서 다음엔 더 잘할 수 있도록 노력해야겠다.',
    diary_image: 'https://picsum.photos/seed/diary2/600/400',
    emotion_main_id: 5,
    is_public: false,
    created_at: '2025-07-19T14:42:00Z',
    updated_at: '2025-07-19T14:45:00Z',
    is_drafted: false,
  },
  {
    id: 'f9cbe7ea-7a4c-43b2-b8e6-bc7df6485671',
    user_id: '1a1c2d4b-5e6f-78a9-b1c2-3e4f567890ab',
    title: '카페에서 만난 사람',
    content:
      '오늘 카페에서 우연히 옛 친구를 만났다. 오랜만에 나눈 대화 속에서 서로의 삶이 참 많이 변했음을 느꼈다. 인연이라는 건 참 묘하다. 서로 다른 길을 걷고 있지만, 가끔 이렇게 만나 추억을 나누는 순간이 소중하게 다가왔다. 함께 웃으며 지나간 시간을 떠올리니 마음 한켠이 따뜻해졌다.',
    diary_image: 'https://picsum.photos/seed/diary3/600/400',
    emotion_main_id: 1,
    is_public: true,
    created_at: '2025-07-18T11:00:00Z',
    updated_at: '2025-07-18T11:30:00Z',
    is_drafted: false,
  },
  {
    id: 'bbf58cf2-3d17-4fd2-86d9-62ecf0cf1fd2',
    user_id: 'b43c4c6e-d6e6-4c43-b998-6b9bfbf2b231',
    title: '기록 테스트',
    content:
      '아직 완성된 글은 아니고 테스트 중이다. 내용과 구성이 조금씩 바뀌고 있으니 완성본을 기대해도 좋을 것이다. 매일 조금씩 기록하면서 글쓰기 감각을 익히고 있다. 앞으로 더 다듬고 보완해 나가면서 멋진 글을 만들어 갈 예정이다.',
    diary_image: null,
    emotion_main_id: 3,
    is_public: false,
    created_at: '2025-07-21T01:12:00Z',
    updated_at: '2025-07-21T01:12:00Z',
    is_drafted: true,
  },
  {
    id: 'c5df7a00-163e-4e2f-801f-33816e29c74b',
    user_id: '312c3a0b-cd9b-49c4-b2d2-faa12efc56f4',
    title: '밤하늘의 별',
    content:
      '오늘 밤하늘은 정말 환상적이었다. 수많은 별들이 반짝였고, 도시의 불빛에도 가려지지 않는 은하수까지 선명하게 보였다. 혼자 걷는 길이었지만 전혀 외롭지 않았다. 오히려 우주와 연결된 듯한 신비한 기분이 들었다. 이런 순간들이 삶을 더욱 풍요롭게 만드는 것 같다.',
    diary_image: 'https://picsum.photos/seed/diary4/600/400',
    emotion_main_id: 4,
    is_public: true,
    created_at: '2025-07-17T22:00:00Z',
    updated_at: '2025-07-17T22:00:00Z',
    is_drafted: false,
  },
  {
    id: 'f3a2a2d4-bb6a-4433-9a12-1b1b36c60c78',
    user_id: '9d5b49f6-38b4-42fa-b3a3-07f38d18444c',
    title: '봄날의 산책',
    content:
      '오늘은 날씨가 너무 좋아서 근처 공원을 한참 걸었다. 벚꽃은 이미 만개해서 분홍빛 꽃잎들이 바람에 살랑거리고 있었다. 아이들은 뛰어놀고, 연인들은 손을 잡고 걷는 모습이 평화로웠다. 잠시 벤치에 앉아 따뜻한 햇살을 느끼며 마음속 깊은 곳까지 평온함이 스며드는 걸 느꼈다.',
    diary_image: 'https://picsum.photos/seed/diary1/600/400',
    emotion_main_id: 2,
    is_public: true,
    created_at: '2025-07-20T09:15:00Z',
    updated_at: '2025-07-20T09:15:00Z',
    is_drafted: false,
  },
];

const emotions = [
  { id: 1, name: '기쁨', icon_url: joyImg },
  { id: 2, name: '슬픔', icon_url: sadnessImg },
  { id: 3, name: '분노', icon_url: angerImg },
  { id: 4, name: '불안', icon_url: anxietyImg },
  { id: 5, name: '놀람', icon_url: surpriseImg },
  { id: 6, name: '평온', icon_url: peaceImg },
  { id: 7, name: '기대', icon_url: expectationImg },
];

const breakpointColumns = {
  default: 2,
  768: 1,
};

const DiaryList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>([]);
  const { filteredDiaries } = useDiariesSearch(diaries, searchTerm, selectedEmotions);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleFilter = useCallback((emotions: Emotion[]) => {
    setSelectedEmotions(emotions);
  }, []);

  return (
    <main className={S.container}>
      <h2 className="sr-only">전체 사용자 일기 목록</h2>
      <section className={S.searchSection}>
        <SearchBox onSearch={handleSearch} />
        <EmotionSelectBox emotions={emotions} onFilter={handleFilter} />
      </section>

      <section aria-label="일기 목록" className={S.diariesSection}>
        {filteredDiaries.length <= 0 ? (
          <p className={S.noResult} role="status">
            검색 결과가 없습니다.
          </p>
        ) : (
          <ul className={S.diaryList}>
            <Masonry
              breakpointCols={breakpointColumns}
              className={S.masonryGrid}
              columnClassName={S.masonryColumn}
            >
              {filteredDiaries.map((diary) => (
                <li key={diary.id}>
                  <DiaryCard diary={diary} emotions={emotions} />
                </li>
              ))}
            </Masonry>
          </ul>
        )}
      </section>
    </main>
  );
};
export default DiaryList;
