create table if not exists public.news_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 12 and 300),
  summary text not null check (char_length(summary) between 30 and 1200),
  category text not null check (category in ('chinh-sach', 'xu-phat', 'canh-bao', 'thi-truong')),
  source_name text not null check (char_length(source_name) between 2 and 120),
  source_url text not null unique check (source_url ~ '^https://'),
  published_at timestamptz not null,
  discovered_at timestamptz not null default now(),
  legal_references text[] not null default '{}',
  investor_takeaway text not null check (char_length(investor_takeaway) between 20 and 800),
  image_url text,
  content_hash text not null unique,
  status text not null default 'published' check (status in ('published', 'hidden')),
  sync_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists news_articles_published_at_idx
  on public.news_articles (published_at desc)
  where status = 'published';

create index if not exists news_articles_sync_date_idx
  on public.news_articles (sync_date desc, published_at desc)
  where status = 'published';

create table if not exists public.news_sync_runs (
  id uuid primary key default gen_random_uuid(),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'running' check (status in ('running', 'success', 'failed')),
  found_count integer not null default 0,
  accepted_count integer not null default 0,
  skipped_count integer not null default 0,
  error_message text,
  metadata jsonb not null default '{}'::jsonb
);

alter table public.news_articles enable row level security;
alter table public.news_sync_runs enable row level security;

revoke all on public.news_articles, public.news_sync_runs from anon, authenticated;
grant select on public.news_articles to anon, authenticated;
grant select on public.news_sync_runs to anon, authenticated;

create policy "published news readable"
on public.news_articles for select to anon, authenticated
using (status = 'published');

create policy "successful sync runs readable"
on public.news_sync_runs for select to anon, authenticated
using (status = 'success');
