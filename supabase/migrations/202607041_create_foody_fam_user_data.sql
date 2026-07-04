create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  avatar_url text,
  provider text default 'password',
  onboarding_completed boolean not null default false,
  subscription_status text not null default 'Free' check (subscription_status in ('Free', 'Premium', 'Unlimited')),
  measurement_system text not null default 'metric' check (measurement_system in ('metric', 'us')),
  temperature_unit text not null default 'celsius' check (temperature_unit in ('celsius', 'fahrenheit')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.family_members (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  name text not null,
  role text not null default 'Family',
  preferences text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.baby_profiles (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  name text not null,
  age text not null,
  style text not null default 'Mixed' check (style in ('Puree', 'BLW', 'Mixed')),
  allergies text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.family_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  allergies text[] not null default '{}',
  diet_preferences text[] not null default '{}',
  favorite_cuisines text[] not null default '{}',
  appliances text[] not null default '{}',
  cooking_goals text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_recipes (
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id text not null,
  recipe_snapshot jsonb,
  created_at timestamptz not null default now(),
  primary key (user_id, recipe_id)
);

create table if not exists public.generated_recipes (
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id text not null,
  recipe_snapshot jsonb not null,
  created_at timestamptz not null default now(),
  primary key (user_id, recipe_id)
);

create table if not exists public.planner_slots (
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null default date_trunc('week', now())::date,
  day text not null,
  meal_type text not null check (meal_type in ('Breakfast', 'Lunch', 'Dinner')),
  recipe_id text,
  meal_snapshot jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, week_start, day, meal_type)
);

create table if not exists public.shopping_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  label text not null,
  category text not null default 'Shopping list',
  checked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create index if not exists generated_recipes_user_created_idx on public.generated_recipes(user_id, created_at desc);
create index if not exists planner_slots_user_week_idx on public.planner_slots(user_id, week_start);

alter table public.profiles enable row level security;
alter table public.family_members enable row level security;
alter table public.baby_profiles enable row level security;
alter table public.family_preferences enable row level security;
alter table public.saved_recipes enable row level security;
alter table public.generated_recipes enable row level security;
alter table public.planner_slots enable row level security;
alter table public.shopping_items enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.family_members to authenticated;
grant select, insert, update, delete on public.baby_profiles to authenticated;
grant select, insert, update, delete on public.family_preferences to authenticated;
grant select, insert, update, delete on public.saved_recipes to authenticated;
grant select, insert, update, delete on public.generated_recipes to authenticated;
grant select, insert, update, delete on public.planner_slots to authenticated;
grant select, insert, update, delete on public.shopping_items to authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own" on public.profiles for delete to authenticated using ((select auth.uid()) = id);

drop policy if exists "family_members_own" on public.family_members;
create policy "family_members_own" on public.family_members for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "baby_profiles_own" on public.baby_profiles;
create policy "baby_profiles_own" on public.baby_profiles for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "family_preferences_own" on public.family_preferences;
create policy "family_preferences_own" on public.family_preferences for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "saved_recipes_own" on public.saved_recipes;
create policy "saved_recipes_own" on public.saved_recipes for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "generated_recipes_own" on public.generated_recipes;
create policy "generated_recipes_own" on public.generated_recipes for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "planner_slots_own" on public.planner_slots;
create policy "planner_slots_own" on public.planner_slots for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "shopping_items_own" on public.shopping_items;
create policy "shopping_items_own" on public.shopping_items for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
