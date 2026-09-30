create extension if not exists pgcrypto;

create table if not exists public.community_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 40),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users(id) on delete set null,
  author_name text not null check (char_length(author_name) between 2 and 80),
  author_role text not null default 'Nhà đầu tư cá nhân',
  category text not null check (category in ('dai-an', 'gop-y-luat', 'kinh-nghiem', 'hoc-thuat')),
  title text not null check (char_length(title) between 10 and 180),
  content text not null check (char_length(content) between 20 and 5000)
    check (lower(content) !~ '(địt mẹ|đụ má|con đĩ|lồn|cặc)')
    check (content !~ '\m0[0-9]{9}\M' and content !~ '\m[0-9]{12}\M'),
  status text not null default 'published' check (status in ('published', 'deleted', 'hidden')),
  is_seeded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  author_name text not null check (char_length(author_name) between 2 and 80),
  author_role text not null default 'Nhà đầu tư cá nhân',
  body text not null check (char_length(body) between 2 and 1500)
    check (lower(body) !~ '(địt mẹ|đụ má|con đĩ|lồn|cặc)')
    check (body !~ '\m0[0-9]{9}\M' and body !~ '\m[0-9]{12}\M'),
  status text not null default 'published' check (status in ('published', 'deleted', 'hidden')),
  is_seeded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.topic_likes (
  topic_id uuid not null references public.topics(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (topic_id, user_id)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('topic', 'comment')),
  target_id uuid not null,
  reason text not null check (char_length(reason) between 5 and 500),
  created_at timestamptz not null default now(),
  unique (reporter_id, target_type, target_id)
);

create table if not exists public.ai_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_date date not null default current_date,
  minute_bucket timestamptz not null default date_trunc('minute', now()),
  minute_count integer not null default 0,
  daily_count integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, usage_date)
);

create or replace function public.prepare_community_author()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  current_name text;
begin
  if current_user_id is null then
    return new;
  end if;

  select display_name into current_name
  from public.community_profiles
  where user_id = current_user_id;

  if current_name is null then
    raise exception 'COMMUNITY_PROFILE_REQUIRED';
  end if;

  new.author_id := current_user_id;
  new.author_name := current_name;
  new.author_role := 'Nhà đầu tư cá nhân';
  new.is_seeded := false;
  return new;
end;
$$;

create or replace function public.enforce_community_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_count integer;
  max_count integer;
begin
  if auth.uid() is null then return new; end if;
  max_count := case when tg_table_name = 'topics' then 3 else 10 end;

  execute format('select count(*) from public.%I where author_id = $1 and created_at > now() - interval ''1 hour''', tg_table_name)
  into recent_count
  using auth.uid();

  if recent_count >= max_count then
    raise exception 'COMMUNITY_RATE_LIMITED';
  end if;
  return new;
end;
$$;

drop trigger if exists topics_prepare_author on public.topics;
create trigger topics_prepare_author before insert on public.topics
for each row execute function public.prepare_community_author();
drop trigger if exists comments_prepare_author on public.comments;
create trigger comments_prepare_author before insert on public.comments
for each row execute function public.prepare_community_author();
drop trigger if exists topics_rate_limit on public.topics;
create trigger topics_rate_limit before insert on public.topics
for each row execute function public.enforce_community_rate_limit();
drop trigger if exists comments_rate_limit on public.comments;
create trigger comments_rate_limit before insert on public.comments
for each row execute function public.enforce_community_rate_limit();

create or replace function public.consume_ai_quota(p_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  row_value public.ai_usage;
  current_minute timestamptz := date_trunc('minute', now());
begin
  insert into public.ai_usage (user_id, usage_date, minute_bucket, minute_count, daily_count)
  values (p_user_id, current_date, current_minute, 1, 1)
  on conflict (user_id, usage_date) do update
  set minute_count = case
        when ai_usage.minute_bucket = current_minute then ai_usage.minute_count + 1
        else 1
      end,
      minute_bucket = current_minute,
      daily_count = ai_usage.daily_count + 1,
      updated_at = now()
  returning * into row_value;

  return row_value.minute_count <= 6 and row_value.daily_count <= 40;
end;
$$;

alter table public.community_profiles enable row level security;
alter table public.topics enable row level security;
alter table public.comments enable row level security;
alter table public.topic_likes enable row level security;
alter table public.reports enable row level security;
alter table public.ai_usage enable row level security;

revoke all on public.community_profiles, public.topics, public.comments, public.topic_likes, public.reports, public.ai_usage from anon, authenticated;
grant select on public.community_profiles, public.topics, public.comments, public.topic_likes to anon, authenticated;
grant insert, update (display_name) on public.community_profiles to authenticated;
grant insert, update (title, content, status, updated_at) on public.topics to authenticated;
grant insert, update (body, status, updated_at) on public.comments to authenticated;
grant insert, delete on public.topic_likes to authenticated;
grant insert on public.reports to authenticated;
revoke all on function public.consume_ai_quota(uuid) from public, anon, authenticated;
grant execute on function public.consume_ai_quota(uuid) to service_role;

create policy "profiles readable" on public.community_profiles for select to anon, authenticated using (true);
create policy "own profile insert" on public.community_profiles for insert to authenticated with check (user_id = auth.uid());
create policy "own profile update" on public.community_profiles for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "published topics readable" on public.topics for select to anon, authenticated
using (status = 'published' or author_id = auth.uid());
create policy "own topic insert" on public.topics for insert to authenticated
with check (author_id = auth.uid() and status = 'published' and is_seeded = false);
create policy "own topic update" on public.topics for update to authenticated
using (author_id = auth.uid() and is_seeded = false)
with check (author_id = auth.uid() and is_seeded = false and status in ('published', 'deleted'));

create policy "published comments readable" on public.comments for select to anon, authenticated
using (status = 'published' or author_id = auth.uid());
create policy "own comment insert" on public.comments for insert to authenticated
with check (author_id = auth.uid() and status = 'published' and is_seeded = false);
create policy "own comment update" on public.comments for update to authenticated
using (author_id = auth.uid() and is_seeded = false)
with check (author_id = auth.uid() and is_seeded = false and status in ('published', 'deleted'));

create policy "likes readable" on public.topic_likes for select to anon, authenticated using (true);
create policy "own like insert" on public.topic_likes for insert to authenticated with check (user_id = auth.uid());
create policy "own like delete" on public.topic_likes for delete to authenticated using (user_id = auth.uid());
create policy "own report insert" on public.reports for insert to authenticated with check (reporter_id = auth.uid());

insert into public.topics (id, author_name, author_role, category, title, content, is_seeded, created_at)
values
  ('10000000-0000-0000-0000-000000000001', 'TS. Nguyễn Phương Thảo', 'Giảng viên hướng dẫn', 'gop-y-luat', 'Đề xuất luật hóa cơ chế Khởi kiện tập thể trong Luật Chứng khoán sửa đổi', 'Nhà đầu tư cá nhân bị thiệt hại do hành vi thao túng giá rất khó tự mình khởi kiện dân sự vì chi phí luật sư cao so với giá trị thiệt hại đơn lẻ. Cần nghiên cứu cơ chế đại diện khởi kiện tập thể và quỹ bảo vệ nhà đầu tư.', true, '2026-09-27 15:40:00+07'),
  ('10000000-0000-0000-0000-000000000002', 'Hoàng Thu Hiền', 'Nhóm 2 · Chương 2', 'dai-an', 'Xác định thiệt hại thực tế trong vụ án thao túng giá cần công thức rõ ràng', 'Khó khăn trong các vụ án về thao túng thị trường là bóc tách phần lỗ do biến động chung và phần thiệt hại trực tiếp từ giao dịch tạo cung cầu giả. Nhóm đề tài đề xuất tham khảo phương pháp Event Study.', true, '2026-09-26 09:20:00+07'),
  ('10000000-0000-0000-0000-000000000003', 'Bùi Minh Khuê', 'Nhóm 2 · Chương 3', 'kinh-nghiem', 'Cảnh giác với điều khoản ủy quyền đặt lệnh toàn quyền trong hợp đồng mở tài khoản', 'Nhà đầu tư không nên giao mật khẩu hoặc OTP cho môi giới để giao dịch hộ. Khi có tranh chấp, việc chứng minh lỗi và yêu cầu bồi thường có thể rất khó khăn.', true, '2026-09-25 14:05:00+07'),
  ('10000000-0000-0000-0000-000000000004', 'Trần Sỹ Long', 'Nhóm 2 · Báo cáo', 'hoc-thuat', 'Nguồn tra cứu số liệu thanh tra và xử phạt của UBCKNN', 'Mời mọi người chia sẻ nguồn dữ liệu chính thức, phương pháp kiểm chứng và cách trích dẫn quyết định xử phạt để hoàn thiện báo cáo nghiên cứu.', true, '2026-09-24 10:15:00+07')
on conflict (id) do nothing;

insert into public.comments (id, topic_id, author_name, author_role, body, is_seeded, created_at)
values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Vũ Anh Quân', 'Nhóm 2 · Word & Web', 'Chương 3 của đề tài cũng phân tích kinh nghiệm khởi kiện tập thể để kiến nghị một cơ chế phù hợp với Việt Nam.', true, '2026-09-27 16:15:00+07'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Ngô Quang Trường', 'Nhóm 2 · Chương 2', 'Cần kết hợp dữ liệu giao dịch, thời điểm công bố thông tin và biến động chỉ số tham chiếu khi lượng hóa thiệt hại.', true, '2026-09-26 11:30:00+07')
on conflict (id) do nothing;

alter publication supabase_realtime add table public.topics;
alter publication supabase_realtime add table public.comments;
alter publication supabase_realtime add table public.topic_likes;
