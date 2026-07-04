# Foody Fam SEO/GEO Launch Checklist

Use this checklist after the Vercel production domain is connected.

## Environment

- Set `NEXT_PUBLIC_APP_URL` to the production domain.
- Set `NEXT_PUBLIC_SUPABASE_AUTH_REDIRECT_URL` to `https://production-domain/auth/callback`.
- Confirm Supabase Auth Site URL and Redirect URLs match the production domain.

## Indexing

- Open `/robots.txt` and confirm private app paths are blocked.
- Open `/sitemap.xml` and confirm public pages, guide pages, and recipe pages are listed.
- Submit `/sitemap.xml` in Google Search Console.
- Inspect `/`, `/recipes`, `/generator`, `/pricing`, and `/recipes/chicken-broccoli-risotto`.

## Rich Results

Validate with Google's Rich Results Test:

- Homepage: Organization, WebSite, SoftwareApplication, FAQPage.
- Generator: SoftwareApplication and FAQPage.
- Pricing: SoftwareApplication and FAQPage.
- Recipe detail pages: Recipe and BreadcrumbList.
- Blog guide pages: FAQPage and BreadcrumbList.

## AI Search / GEO

- Confirm answer blocks are visible on homepage, generator, recipes, planner, shopping, nutrition, and pricing.
- Confirm guide pages answer one clear parent question in the first screen.
- Confirm safety copy says Foody Fam is not medical advice.
- Add new guide pages when Search Console shows impressions for related baby meal planning queries.

## Performance

- Run Lighthouse mobile and desktop for homepage, recipes, generator, pricing, and one recipe page.
- Target: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 100.
- Check image LCP on homepage and recipe pages.
- Keep generated visual assets behind Next image optimization and prefer Vercel WebP/AVIF delivery.
