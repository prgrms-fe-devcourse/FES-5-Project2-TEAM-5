import type { Database } from '../../../../shared/supabase/database.types';

export type DbUser = Database['public']['Tables']['users']['Row'];
