import S from './style.module.css';
import IconExpect from '/src/assets/icon_expect.svg';
import ThumbImage from '../../assets/@thumb.png';
import DiaryRowCard from '@/shared/components/DiaryRowCard';
import type { DiaryEntity } from '@/shared/types/diary';

const diaryEntries: DiaryEntity[] = [
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

const DiarySection = () => {
  return (
    <section className={S.contents}>
      <h2 className="sr-only">작성한 일기 목록</h2>
      <ul className={S.diaryList}>
        {diaryEntries.map((diary) => (
          <DiaryRowCard {...diary} key={diary.id} />
        ))}
      </ul>
    </section>
  );
};
export default DiarySection;
