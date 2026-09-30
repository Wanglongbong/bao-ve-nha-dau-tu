import { createHash } from 'node:crypto';
import { load } from 'cheerio';
import type { SupabaseClient } from '@supabase/supabase-js';

export const CAFEF_MARKET_URL = 'https://cafef.vn/thi-truong-chung-khoan.chn';
const MAX_ARTICLES = 12;

export interface CafeFArticle {
  title: string;
  summary: string;
  category: 'thi-truong';
  source_name: 'CafeF';
  source_url: string;
  published_at: string;
  legal_references: string[];
  investor_takeaway: string;
  image_url: string | null;
  content_hash: string;
  status: 'published';
  sync_date: string;
  updated_at: string;
}

function vietnamDate(value = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(value);
}

function absoluteUrl(raw: string): string {
  if (!raw) return '';
  try { return new URL(raw, CAFEF_MARKET_URL).toString().split('#')[0]; } catch { return ''; }
}

function clean(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export async function fetchCafeFMarketNews(): Promise<CafeFArticle[]> {
  const result = await fetch(CAFEF_MARKET_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; BaoVeNhaDauTu/1.0; +https://bao-ve-nha-dau-tu.vercel.app)',
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.7',
    },
    signal: AbortSignal.timeout(12_000),
  });
  if (!result.ok) throw new Error(`CafeF trả về HTTP ${result.status}`);

  const $ = load(await result.text());
  const today = vietnamDate();
  const now = new Date().toISOString();
  const rows: CafeFArticle[] = [];

  $('.tlitem.box-category-item').each((_, element) => {
    if (rows.length >= MAX_ARTICLES) return false;
    const link = $(element).find('h3 a').first();
    const title = clean(link.text());
    const sourceUrl = absoluteUrl(link.attr('href') || '');
    const published = new Date($(element).find('.time.time-ago').first().attr('title') || '');
    const summary = clean($(element).find('.sapo.box-category-sapo').first().text());
    const imageUrl = absoluteUrl($(element).find('.avatar img').first().attr('src') || '');
    if (title.length < 12 || !sourceUrl.startsWith('https://cafef.vn/') || Number.isNaN(published.getTime())) return;
    if (vietnamDate(published) !== today) return;
    rows.push({
      title: title.slice(0, 300),
      summary: summary.length >= 30 ? summary.slice(0, 1_200) : 'Tin thị trường chứng khoán mới đăng trên CafeF. Mở bài gốc để đọc đầy đủ nội dung và kiểm tra thông tin trước khi ra quyết định.',
      category: 'thi-truong', source_name: 'CafeF', source_url: sourceUrl,
      published_at: published.toISOString(), legal_references: [],
      investor_takeaway: 'Đây là tin thị trường từ CafeF; hãy đọc bài gốc, đối chiếu nguồn chính thức và không xem nội dung này là khuyến nghị mua bán.',
      image_url: imageUrl || null,
      content_hash: createHash('sha256').update(sourceUrl).digest('hex'),
      status: 'published', sync_date: today, updated_at: now,
    });
  });
  return rows;
}

export async function syncCafeFNews(supabase: SupabaseClient, trigger: 'cron' | 'manual') {
  const { data: run, error: runError } = await supabase.from('news_sync_runs')
    .insert({ status: 'running', metadata: { source: CAFEF_MARKET_URL, trigger } }).select('id').single();
  if (runError || !run) throw new Error('Không thể tạo nhật ký đồng bộ tin.');
  try {
    const articles = await fetchCafeFMarketNews();
    if (articles.length) {
      const { error } = await supabase.from('news_articles').upsert(articles, { onConflict: 'source_url' });
      if (error) throw error;
    }
    const finishedAt = new Date().toISOString();
    await supabase.from('news_sync_runs').update({
      status: 'success', finished_at: finishedAt, found_count: articles.length,
      accepted_count: articles.length, skipped_count: 0,
      metadata: { source: CAFEF_MARKET_URL, trigger, syncDate: vietnamDate() },
    }).eq('id', run.id);
    return { articles, finishedAt };
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 500) : 'Lỗi đồng bộ không xác định';
    await supabase.from('news_sync_runs').update({ status: 'failed', finished_at: new Date().toISOString(), error_message: message }).eq('id', run.id);
    throw error;
  }
}

export async function recentlySynced(supabase: SupabaseClient, minutes = 10): Promise<boolean> {
  const cutoff = new Date(Date.now() - minutes * 60_000).toISOString();
  const { data } = await supabase.from('news_sync_runs').select('id').eq('status', 'success').gte('finished_at', cutoff).limit(1);
  return Boolean(data?.length);
}
