drop policy if exists "beta_feedback_public_insert" on public.beta_feedback;
create policy "beta_feedback_public_insert" on public.beta_feedback
for insert
to anon, authenticated
with check (user_id is null or user_id = (select auth.uid()));

drop policy if exists "analytics_events_public_insert" on public.analytics_events;
create policy "analytics_events_public_insert" on public.analytics_events
for insert
to anon, authenticated
with check (
  (user_id is null or user_id = (select auth.uid()))
  and event_name in (
    'generator_started',
    'recipe_generated',
    'recipe_saved',
    'signup_started',
    'signup_completed',
    'plan_selected',
    'checkout_started',
    'checkout_completed',
    'feedback_submitted'
  )
);
