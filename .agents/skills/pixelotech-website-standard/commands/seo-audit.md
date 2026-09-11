---
description: Apply or audit the standard SEO package
argument-hint: [optional: route or "audit" to review existing coverage]
---

Use the `pixelotech-website-standard` skill, then read and follow `references/seo.md`.

Scope: $ARGUMENTS

The full SEO package is standard on every site, not an upsell. Ensure all of it is present:

- Per-page metadata (title, description) for every route
- Open Graph + Twitter cards
- `sitemap.ts` and `robots.ts`
- Canonical URLs
- JSON-LD structured data
- A real OG image (not a placeholder)

If a scope/route was given, focus there; otherwise audit the whole site and report each item as
present / missing, then fix the gaps. SEO is a large part of what clients pay for — a site missing
any of the above is not done.
