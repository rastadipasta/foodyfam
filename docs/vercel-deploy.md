# Foody Fam Vercel Deploy Checklist

Foody Fam is ready for a Vercel Git deployment from GitHub. Import the repository, keep the root directory as the project root, and let Vercel detect Next.js.

## Build Settings

- Framework preset: `Next.js`
- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: leave default
- Node.js: Vercel default for Next.js is fine

## Required Environment Variables

Set these in Vercel Project Settings for Production, Preview, and Development as needed:

```bash
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://qdfccvfvphxgtbtpfdcb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
NEXT_PUBLIC_SUPABASE_AUTH_REDIRECT_URL=https://your-vercel-domain.vercel.app/auth/callback
OPENAI_API_KEY=sk-proj-...
OPENAI_RECIPE_MODEL=gpt-5.4-nano
OPENAI_MODEL=gpt-5.4-mini
```

Optional future variables:

```bash
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_AUTH_GOOGLE_CLIENT_ID=
SUPABASE_AUTH_GOOGLE_CLIENT_SECRET=
SUPABASE_AUTH_APPLE_CLIENT_ID=
SUPABASE_AUTH_APPLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PREMIUM_MONTHLY=
STRIPE_PRICE_PREMIUM_YEARLY=
STRIPE_PRICE_UNLIMITED_MONTHLY=
STRIPE_PRICE_UNLIMITED_YEARLY=
RESEND_API_KEY=
NEXT_PUBLIC_POSTHOG_KEY=
```

For six-digit signup verification, update the Supabase **Confirm signup** email template to display `{{ .Token }}`. In Stripe, create four recurring EUR prices and point the webhook endpoint to `/api/billing/webhook`.

Keep `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, Stripe, and Resend values server-only. Do not prefix secrets with `NEXT_PUBLIC_`.

## Supabase Auth URLs

In Supabase Auth settings, add the deployed Vercel URLs:

- Site URL: `https://your-vercel-domain.vercel.app`
- Redirect URL: `https://your-vercel-domain.vercel.app/auth/callback`
- For preview deployments, add the preview URL pattern or the exact preview URL before testing OAuth.

Google and Apple buttons are wired through Supabase, but they need provider credentials configured in the Supabase dashboard before production OAuth works.

## SEO After Domain Setup

After the final domain is connected, update `NEXT_PUBLIC_APP_URL` to that exact domain. This controls canonical URLs, Open Graph URLs, `robots.txt`, and `sitemap.xml`.

Then follow:

```bash
docs/seo-launch-checklist.md
```

## Database

The production Supabase project already has the V1 user-data schema applied. The migration is also committed at:

```bash
supabase/migrations/202607041_create_foody_fam_user_data.sql
```

The recipe database remains local code/data. Supabase stores only user state: profiles, preferences, generated recipes, saved recipes, planner slots, and shopping items.

## Pre-Deploy Checks

Run locally before pushing:

```bash
npm run lint
npm run typecheck
npm run build
```

After importing the GitHub repo into Vercel, every push to `main` will create a production deployment if the project is configured that way. Pull requests and non-production branches create preview deployments.
