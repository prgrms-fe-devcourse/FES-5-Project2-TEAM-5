import type { Database } from '@/shared/api/supabase/types';

export type Emotion = Database['public']['Tables']['emotion_mains']['Row'];
