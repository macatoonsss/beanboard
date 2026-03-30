// utils/supabase/middleware.ts
import { supabaseServer } from './server';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabaseServer.from('_users').select('*');
  if (error) return res.status(500).json({ error });
  return res.status(200).json({ data });
}