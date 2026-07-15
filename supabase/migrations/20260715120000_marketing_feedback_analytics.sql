update public.profiles
set subscription_status = 'Family'
where subscription_status = 'Premium';

alter table public.profiles
  drop constraint if exists profiles_subscription_status_check;

alter table public.profiles
  add constraint profiles_subscription_status_check
  check (subscription_status in ('Free', 'Family', 'Unlimited'));

create table if not exists public.beta_feedback (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete set null,
  email text,
  baby_age text,
  cooking_frequency text,
  biggest_dinner_problem text,
  consent boolean not null default false,
  recipe_id text,
  recipe_title text,
  cooked boolean,
  baby_ate boolean,
  confusion text,
  willingness_to_pay text,
  created_at timestamptz not null default now()
);

create index if not exists beta_feedback_created_idx on public.beta_feedback(created_at desc);
create index if not exists beta_feedback_user_idx on public.beta_feedback(user_id, created_at desc);

alter table public.beta_feedback enable row level security;

grant insert on public.beta_feedback to anon, authenticated;
grant select on public.beta_feedback to authenticated;
grant usage, select on sequence public.beta_feedback_id_seq to anon, authenticated;

drop policy if exists "beta_feedback_public_insert" on public.beta_feedback;
create policy "beta_feedback_public_insert" on public.beta_feedback
for insert
to anon, authenticated
with check (true);

drop policy if exists "beta_feedback_admin_select" on public.beta_feedback;
create policy "beta_feedback_admin_select" on public.beta_feedback
for select
to authenticated
using (public.is_admin());

create table if not exists public.analytics_events (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete set null,
  event_name text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_name_created_idx on public.analytics_events(event_name, created_at desc);
create index if not exists analytics_events_user_created_idx on public.analytics_events(user_id, created_at desc);

alter table public.analytics_events enable row level security;

grant insert on public.analytics_events to anon, authenticated;
grant select on public.analytics_events to authenticated;
grant usage, select on sequence public.analytics_events_id_seq to anon, authenticated;

drop policy if exists "analytics_events_public_insert" on public.analytics_events;
create policy "analytics_events_public_insert" on public.analytics_events
for insert
to anon, authenticated
with check (event_name in (
  'generator_started',
  'recipe_generated',
  'recipe_saved',
  'signup_started',
  'signup_completed',
  'plan_selected',
  'checkout_started',
  'checkout_completed',
  'feedback_submitted'
));

drop policy if exists "analytics_events_admin_select" on public.analytics_events;
create policy "analytics_events_admin_select" on public.analytics_events
for select
to authenticated
using (public.is_admin());
