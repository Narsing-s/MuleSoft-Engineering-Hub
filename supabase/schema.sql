-- Run in Supabase SQL Editor.
create table if not exists public.articles (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 slug text unique not null,
 excerpt text not null,
 category text not null,
 content text not null,
 published boolean not null default false,
 published_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
alter table public.articles enable row level security;
-- Public can read published articles only.
create policy "Published articles are public" on public.articles
 for select using (published = true);
-- Authenticated owner can manage records; restrict allowed user in production
-- with a Supabase Auth user allowlist / JWT claim policy before enabling writes.
create policy "Authenticated users can insert" on public.articles
 for insert to authenticated with check (auth.jwt()->>'email' = 'narsingbeesetti006@gmail.com');
create policy "Authenticated owner can update" on public.articles
 for update to authenticated using (auth.jwt()->>'email' = 'narsingbeesetti006@gmail.com')
 with check (auth.jwt()->>'email' = 'narsingbeesetti006@gmail.com');
create policy "Authenticated owner can delete" on public.articles
 for delete to authenticated using (auth.jwt()->>'email' = 'narsingbeesetti006@gmail.com');
