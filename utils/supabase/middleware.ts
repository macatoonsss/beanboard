import { supabaseServer } from './server';
import { NextApiRequest, NextApiResponse } from 'next';

export async function requireAuth(req: NextApiRequest, res: NextApiResponse, next: Function) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const { data: user, error } = await supabaseServer.auth.getUser(token);

  if (error || !user) return res.status(401).json({ error: 'Unauthorized' });

  // attach user to request object
  (req as any).user = user;
  next();
}