# Production Launch Checklist (Human)

Run `scripts/readiness-check.mjs` first and fix everything it reports. Then walk this list — these are the things a script can't judge. Check items off explicitly with the user; do not compress this into "looks good".

## Content

- [ ] Every page has real, client-approved copy — no lorem ipsum, no "plausible copy" that the client never reviewed
- [ ] Phone number, email, address, and business hours are correct (call/click them, don't just read them)
- [ ] Logo is the real logo file (not a placeholder), favicon is brand-derived
- [ ] Legal pages exist and are linked in the footer: privacy policy (required — GA4), plus terms/imprint if the client's industry needs them
- [ ] No internal jargon, staging URLs, or company-side notes anywhere in visible content

## Design & responsive

- [ ] Every page reviewed at 375px, 768px, 1440px — no horizontal scroll, no overlapping text, nav usable on mobile
- [ ] Interactive states work: hover, focus (tab through the whole page), mobile menu open/close
- [ ] Images look sharp on a retina display but files stay within budget (photos ≤ 200KB)
- [ ] Dark-mode check: if the site doesn't support dark mode, confirm it still renders correctly for users with dark OS themes (no invisible text from inherited variables)

## Forms (test against the REAL endpoint)

- [ ] Submit the contact form with real-ish data → submission arrives (email received / visible in the forms dashboard)
- [ ] Submit with invalid email → inline validation catches it before POST
- [ ] Error state verified (temporarily point at a bad URL or block the request) → friendly error + fallback contact info shows, entered data not lost
- [ ] `src/lib/forms.ts` points at `https://form-submission.pixelotech.com/submit` (the company endpoint), unmodified

## SEO & analytics

- [ ] Titles/descriptions read like a human wrote them for each specific page (script only checks presence/length)
- [ ] JSON-LD validates in Google's Rich Results Test with zero errors
- [ ] OG image: paste the pages.dev URL into a WhatsApp/Slack message and look at the actual preview card
- [ ] `NEXT_PUBLIC_GA_ID` set in Cloudflare Pages env (not just locally); GA4 Realtime shows your visit
- [ ] If client targets EU/UK: consent decision was made explicitly with the user (banner or cookieless swap) — not defaulted

## Performance

- [ ] Lighthouse (or PageSpeed Insights) on the pages.dev URL, mobile: Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95. Investigate any score below target rather than negotiating the target down
- [ ] LCP element is the hero image/text and it has `priority` set

## Deploy & domain

- [ ] Production deploy from `main` is green; preview URL and production show identical content
- [ ] Custom domain live on HTTPS, www/apex redirect works one way
- [ ] Client's email (MX records) untouched by any DNS changes — send a test email to the client's address after DNS work
- [ ] 404 page: visit `https://domain.com/no-such-page` on production
- [ ] Sitemap submitted in Google Search Console
- [ ] `main` branch protection enabled

## Handoff

- [ ] README present (generated from `assets/readme-template.md`), badge versions match `package.json`, and its production-domain link is the real domain
- [ ] Client told where to send content-change requests (there is no CMS — changes go through us)

---

© 2026 Pixelotech. All rights reserved. Proprietary — Pixelotech internal use only. See LICENSE.md. Contact: https://pixelotech.com
