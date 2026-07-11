create or replace function public.is_admin()
returns boolean
language sql
security invoker
stable
set search_path = public, auth
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

drop policy if exists "avatars_public_read" on storage.objects;
