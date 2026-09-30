import { createClient } from '@supabase/supabase-js';
import { syncCafeFNews } from './_lib/cafef.js';

type ApiRequest = { method?: string; headers: Record<string, string | string[] | undefined> };
type ApiResponse = { status: (code: number) => ApiResponse; json: (body: unknown) => void; setHeader: (name: string, value: string) => void };
const header = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] || '' : value || '';

export default async function handler(request: ApiRequest, response: ApiResponse) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'GET') return response.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  if (!process.env.CRON_SECRET || header(request.headers.authorization) !== `Bearer ${process.env.CRON_SECRET}`) {
    return response.status(401).json({ ok: false, error: 'UNAUTHORIZED' });
  }
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return response.status(503).json({ ok: false, error: 'CONFIG_MISSING' });
  try {
    const result = await syncCafeFNews(createClient(url, key, { auth: { persistSession: false } }), 'cron');
    return response.status(200).json({ ok: true, accepted: result.articles.length, finishedAt: result.finishedAt });
  } catch (error) {
    console.error('[news-sync]', error);
    return response.status(502).json({ ok: false, error: 'CAFEF_SYNC_FAILED' });
  }
}
