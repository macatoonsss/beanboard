// utils/supabase/server.ts
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load env from project root
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env.local');
}

export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey);

// Optional test query
(async () => {
  const { data, error } = await supabaseServer.from('_users').select('*');
  if (error) console.error('Supabase error:', error);
  else console.log('Supabase data:', data);
})();