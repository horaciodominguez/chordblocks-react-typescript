-- Repertoires table (mirror of songs JSON row pattern)
-- Run in Supabase SQL editor if the table does not exist yet.

create table if not exists public.repertoires (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists repertoires_user_id_idx on public.repertoires (user_id);

alter table public.repertoires enable row level security;

create policy "repertoires_select_own"
  on public.repertoires for select
  using (auth.uid() = user_id);

create policy "repertoires_insert_own"
  on public.repertoires for insert
  with check (auth.uid() = user_id);

create policy "repertoires_update_own"
  on public.repertoires for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "repertoires_delete_own"
  on public.repertoires for delete
  using (auth.uid() = user_id);
