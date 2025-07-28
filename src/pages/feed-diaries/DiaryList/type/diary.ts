import type { Database } from '@/shared/api/supabase/types';

export type Diary = Database['public']['Tables']['diaries']['Row'];
