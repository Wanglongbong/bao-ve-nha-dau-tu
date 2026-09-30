import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

let sessionPromise: Promise<Session> | null = null;

async function requestTurnstileToken(): Promise<string | undefined> {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim();
  if (!siteKey || typeof document === 'undefined') return undefined;

  if (!window.turnstile) {
    await new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-bvndt-turnstile]');
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error('Không tải được lớp chống bot.')), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.dataset.bvndtTurnstile = 'true';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Không tải được lớp chống bot.'));
      document.head.appendChild(script);
    });
  }

  if (!window.turnstile) throw new Error('Turnstile chưa sẵn sàng.');
  return new Promise<string>((resolve, reject) => {
    const host = document.createElement('div');
    host.className = 'turnstile-gate';
    document.body.appendChild(host);
    let widgetId = '';
    const cleanup = () => {
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
      host.remove();
    };
    widgetId = window.turnstile!.render(host, {
      sitekey: siteKey,
      theme: 'light',
      callback: (token: string) => { cleanup(); resolve(token); },
      'error-callback': () => { cleanup(); reject(new Error('Không thể xác minh chống bot.')); },
      'expired-callback': () => { cleanup(); reject(new Error('Phiên xác minh chống bot đã hết hạn.')); },
    });
  });
}

export async function ensureAnonymousSession(captchaToken?: string): Promise<Session> {
  if (!supabase) {
    throw new Error('SUPABASE_NOT_CONFIGURED');
  }

  const { data: current } = await supabase.auth.getSession();
  if (current.session) return current.session;

  if (!sessionPromise) {
    sessionPromise = requestTurnstileToken()
      .then((generatedToken) => captchaToken || generatedToken)
      .then((verifiedToken) => supabase.auth.signInAnonymously(verifiedToken ? { options: { captchaToken: verifiedToken } } : undefined))
      .then(({ data, error }) => {
        if (error || !data.session) {
          throw new Error(error?.message || 'Không thể tạo phiên cộng đồng ẩn danh.');
        }
        return data.session;
      })
      .finally(() => {
        sessionPromise = null;
      });
  }

  return sessionPromise;
}

export async function getAccessToken(): Promise<string> {
  const session = await ensureAnonymousSession();
  return session.access_token;
}
