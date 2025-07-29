import type { Database } from '@/shared/api/supabase/types';

export interface SupabaseDiaryResponse {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_public: boolean;
  diary_image: string | null;
  emotion_mains: { name: string; icon_url: string };
  diary_hashtags: { hashtags: { id: string; name: string } }[];
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
}

export type Diary = Database['public']['Tables']['diaries']['Row'];
