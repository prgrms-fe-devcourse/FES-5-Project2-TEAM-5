import { createClient } from '@supabase/supabase-js';

// npx supabase gen types typescript --project-id ttqedeydfvolnyrivpvg > src/shared/supabase/database.types.ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
