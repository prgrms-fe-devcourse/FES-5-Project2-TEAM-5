import S from './style.module.css';
import IconExpect from '../../../assets/icon_expect.png';
import ThumbImage from '../../../assets/@thumb.png';
import DiaryItem from '../DiaryItem';

interface Props {
  id: number;
  emotionIcon: string;
  emotionText: string;
  title: string;
  tags: string[];
  likes: number;
  comments: number;
  date: string;
  thumbnail?: string;
}

const diaryEntries: Props[] = [
  {
    id: 1,
    emotionIcon: IconExpect,
    emotionText: '기대',
    title: '오늘은 날씨가 선선해서 기분이 좋아',
    tags: ['날씨', '씨앗일기', '감정일기'],
    likes: 23,
    comments: 5,
    date: '2025-07-20',
    thumbnail: ThumbImage,
  },
  {
    id: 2,
    emotionIcon: IconExpect,
    emotionText: '기대',
    title: '좋은 친구를 만났어',
    tags: ['친구', '행복'],
    likes: 15,
    comments: 2,
    date: '2025-06-18',
  },
];

function DiaryList() {
  return (
    <ul className={S.diaryList}>
      {diaryEntries.map((entry) => (
        <DiaryItem key={entry.id} {...entry} />
      ))}
    </ul>
  );
}

export default DiaryList;
