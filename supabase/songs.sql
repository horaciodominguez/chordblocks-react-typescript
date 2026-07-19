-- Songs table (canonical charts as JSON rows)
-- Run in Supabase SQL editor if the table does not exist yet.

create table if not exists public.songs (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists songs_user_id_idx on public.songs (user_id);

alter table public.songs enable row level security;

create policy "songs_select_own"
  on public.songs for select
  using (auth.uid() = user_id);

create policy "songs_insert_own"
  on public.songs for insert
  with check (auth.uid() = user_id);

create policy "songs_update_own"
  on public.songs for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "songs_delete_own"
  on public.songs for delete
  using (auth.uid() = user_id);
