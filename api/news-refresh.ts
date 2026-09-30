import { createClient } from '@supabase/supabase-js';
import { recentlySynced, syncCafeFNews } from './_lib/cafef.js';

type ApiRequest = { method?: string; headers: Record<string, string | string[] | undefined> };
type ApiResponse = { status: (code: number) => ApiResponse; json: (body: unknown) => void; setHeader: (name: string, value: string) => void };
const bearer = (headers: ApiRequest['headers']) => {
  const raw = Array.isArray(headers.authorization) ? headers.authorization[0] : headers.authorization;
  return raw?.startsWith('Bearer ') ? raw.slice(7) : '';
};

export default async function handler(request: ApiRequest, response: ApiResponse) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'POST') return response.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return response.status(503).json({ ok: false, error: 'CONFIG_MISSING' });
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase.auth.getUser(bearer(request.headers));
  if (error || !data.user) return response.status(401).json({ ok: false, error: 'UNAUTHORIZED' });
  try {
    if (await recentlySynced(supabase)) return response.status(200).json({ ok: true, cached: true });
    const result = await syncCafeFNews(supabase, 'manual');
    return response.status(200).json({ ok: true, cached: false, accepted: result.articles.length, finishedAt: result.finishedAt });
  } catch (syncError) {
    console.error('[news-refresh]', syncError);
    return response.status(502).json({ ok: false, error: 'CAFEF_SYNC_FAILED', message: 'CafeF tạm thời chưa phản hồi; kho tin gần nhất vẫn được giữ nguyên.' });
  }
}
