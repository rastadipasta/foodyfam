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

  auth_provider := case
    when coalesce(new.raw_app_meta_data ->> 'provider', 'password') in ('google', 'apple') then new.raw_app_meta_data ->> 'provider'
    else 'password'
  end;

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
select
  users.id,
  coalesce(users.email, ''),
  coalesce(
    users.raw_user_meta_data ->> 'display_name',
    users.raw_user_meta_data ->> 'full_name',
    users.raw_user_meta_data ->> 'name',
    split_part(users.email, '@', 1),
    'Foody Parent'
  ),
  users.raw_user_meta_data ->> 'avatar_url',
  case
    when coalesce(users.raw_app_meta_data ->> 'provider', 'password') in ('google', 'apple') then users.raw_app_meta_data ->> 'provider'
    else 'password'
  end,
  false,
  'Free',
  'metric',
  'celsius',
  'user',
  'active'
from auth.users as users
left join public.profiles as profiles on profiles.id = users.id
where profiles.id is null
on conflict (id) do nothing;
