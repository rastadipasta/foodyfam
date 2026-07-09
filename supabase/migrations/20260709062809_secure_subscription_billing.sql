alter table public.profiles
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_state text not null default 'active'
    check (subscription_state in ('active', 'trialing', 'past_due', 'canceled', 'unpaid'));

create unique index if not exists profiles_stripe_customer_idx
  on public.profiles(stripe_customer_id)
  where stripe_customer_id is not null;

create unique index if not exists profiles_stripe_subscription_idx
  on public.profiles(stripe_subscription_id)
  where stripe_subscription_id is not null;

create or replace function public.protect_profile_entitlements()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if current_user in ('postgres', 'service_role') then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if new.role <> 'user'
      or new.account_status <> 'active'
      or new.subscription_status <> 'Free'
      or new.stripe_customer_id is not null
      or new.stripe_subscription_id is not null
    then
      raise exception 'Profile entitlement fields are server-managed';
    end if;
    return new;
  end if;

  if public.is_admin() then
    return new;
  end if;

  if new.role is distinct from old.role
    or new.account_status is distinct from old.account_status
    or new.subscription_status is distinct from old.subscription_status
    or new.subscription_state is distinct from old.subscription_state
    or new.stripe_customer_id is distinct from old.stripe_customer_id
    or new.stripe_subscription_id is distinct from old.stripe_subscription_id
    or new.billing_interval is distinct from old.billing_interval
    or new.subscription_current_period_end is distinct from old.subscription_current_period_end
  then
    raise exception 'Profile entitlement fields are server-managed';
  end if;

  return new;
end;
$$;

drop trigger if exists protect_profile_entitlements_trigger on public.profiles;
create trigger protect_profile_entitlements_trigger
before insert or update on public.profiles
for each row execute function public.protect_profile_entitlements();
