import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wtasxmqhjsnbnsivjxnb.supabase.co';
const supabaseAnonKey = 'sb_publishable_C1vHCOIs8jxMMfHEaouX4w_EMSrrrNU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
