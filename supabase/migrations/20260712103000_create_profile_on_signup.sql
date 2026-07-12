create or replace function public.handle_new_auth_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  display_name text;
  auth_provider text;
begin
  display_name := coalesce(
    new.raw_user_meta_data ->> 'display_name',
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name',
    split_part(new.email, '@', 1),
    'Foody Parent'
  );

  auth_provider := coalesce(new.raw_app_meta_data ->> 'provider', 'password');

  insert into public.profiles (
    id,
    email,
    display_name,
    avatar_url,
    provider,
    onboarding_completed,
    subscription_status,
    measurement_system,
    temperature_unit,
    role,
    account_status
  )
  values (
    new.id,
    coalesce(new.email, ''),
    display_name,
    new.raw_user_meta_data ->> 'avatar_url',
    auth_provider,
    false,
    'Free',
    'metric',
    'celsius',
    'user',
    'active'
  )
  on conflict (id) do update
  set email = excluded.email,
      display_name = coalesce(public.profiles.display_name, excluded.display_name),
      avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
      provider = excluded.provider,
      updated_at = now();

  return new;
end;
$$;

revoke all on function public.handle_new_auth_user_profile() from public, anon, authenticated;

drop trigger if exists on_auth_user_created_create_profile on auth.users;
create trigger on_auth_user_created_create_profile
after insert on auth.users
for each row execute function public.handle_new_auth_user_profile();
