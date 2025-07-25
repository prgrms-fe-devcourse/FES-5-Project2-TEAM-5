export interface DiaryEntity {
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
