import type { Database } from '@/shared/api/supabase/types';

export interface SupabaseDiaryResponse {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_public: boolean;
  is_analyzed: boolean;
  diary_image: string | null;
  emotion_mains: { name: string; icon_url: string }[];
  diary_hashtags: { hashtags: { id: string; name: string }[] }[];
  likes: { count: number }[];
  comments: { count: number }[];
}

export interface DiaryRowEntity {
  id: string;
  title: string;
  created_at: string;
  is_public: boolean;
  diary_image: string | null;
  likes: number;
  comments: number;
  diary_hashtags: { name: string; id: string }[];
  emotion_mains: { name: string; icon_url: string };
  is_analyzed?: boolean;
}

export type Diary = Database['public']['Tables']['diaries']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'];
export type Like = Database['public']['Tables']['likes']['Row'];
export type Hashtag = Database['public']['Tables']['hashtags']['Row'];
export type EmotionMain = Database['public']['Tables']['emotion_mains']['Row'];
export type User = Database['public']['Tables']['users']['Row'];

export type DiaryDetailEntity = Diary & {
  emotion_mains: EmotionMain | null;
  diary_hashtags: {
    hashtags: Hashtag;
  }[];
  likes_count: number;
  comments_count: number;
};

export interface DisplayComment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  profile_image_url?: string | null;
  user_id: string;
  created_at: string;
}
