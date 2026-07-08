alter table public.profiles
  add column if not exists role text not null default 'user' check (role in ('user', 'admin')),
  add column if not exists account_status text not null default 'active' check (account_status in ('active', 'suspended')),
  add column if not exists stripe_customer_id text,
  add column if not exists billing_interval text check (billing_interval in ('monthly', 'yearly')),
  add column if not exists subscription_current_period_end timestamptz;

create table if not exists public.admin_audit_logs (
  id bigserial primary key,
  admin_id uuid references auth.users(id) on delete set null,
  target_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_subscription_status_idx on public.profiles(subscription_status);
create index if not exists admin_audit_logs_target_created_idx on public.admin_audit_logs(target_user_id, created_at desc);

alter table public.admin_audit_logs enable row level security;

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert on public.admin_audit_logs to authenticated;
grant usage, select on sequence public.admin_audit_logs_id_seq to authenticated;

create or replace function public.is_admin()
returns boolean
language sql
security invoker
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
      and account_status = 'active'
  );
$$;

grant execute on function public.is_admin() to authenticated;

drop policy if exists "profiles_admin_select" on public.profiles;
create policy "profiles_admin_select" on public.profiles
for select to authenticated
using (public.is_admin());

drop policy if exists "profiles_admin_update" on public.profiles;
create policy "profiles_admin_update" on public.profiles
for update to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin_audit_logs_admin_read" on public.admin_audit_logs;
create policy "admin_audit_logs_admin_read" on public.admin_audit_logs
for select to authenticated
using (public.is_admin());

drop policy if exists "admin_audit_logs_admin_insert" on public.admin_audit_logs;
create policy "admin_audit_logs_admin_insert" on public.admin_audit_logs
for insert to authenticated
with check (public.is_admin() and (select auth.uid()) = admin_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read" on storage.objects
for select to public
using (bucket_id = 'avatars');

drop policy if exists "avatars_user_insert" on storage.objects;
create policy "avatars_user_insert" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "avatars_user_update" on storage.objects;
create policy "avatars_user_update" on storage.objects
for update to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "avatars_user_delete" on storage.objects;
create policy "avatars_user_delete" on storage.objects
for delete to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
