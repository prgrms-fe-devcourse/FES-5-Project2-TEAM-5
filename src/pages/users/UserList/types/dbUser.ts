import type { Database } from '@/shared/api/supabase/types';

export type DbUser = Database['public']['Tables']['users']['Row'];
