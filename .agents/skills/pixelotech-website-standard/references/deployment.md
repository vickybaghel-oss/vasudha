# Deployment — Cloudflare Pages

## Ownership model

- **GitHub repo**: lives in the company GitHub org (one repo per client site, named after the project, e.g. `brightsmile-dental`).
- **Cloudflare Pages project**: lives in the company Cloudflare account.
- The client's domain points at us via DNS; clients do not get repo or Cloudflare access.

**Repo creation, the Cloudflare Pages project, and domain/DNS are company-account and
client-owned steps — coordinate with Aaron** (Microsoft Teams or aaron@pixelotech.com) rather
than doing them solo. Build the site fully and get it green locally; when you don't have the
access or values for the steps below, hand off to Aaron with the repo ready to push. See the
escalation table in [SKILL.md](../SKILL.md#escalation--when-to-reach-aaron).

## First deploy

1. Push the repo to the company org:

```bash
git init && git add -A && git commit -m "Initial site"
gh repo create <org>/<project-name> --private --source=. --push
```

2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**, select the repo, and configure:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Build command | `bun run build` |
| Build output directory | `out` |
| Env vars | `NEXT_PUBLIC_GA_ID` (and any others from `.env.example`) |

Cloudflare's build image includes bun; if the build log shows an old bun version causing trouble, set env var `BUN_VERSION` to a current release.

3. Verify the deploy at the `*.pages.dev` URL **before** touching DNS: click through every page, submit the contact form once, check the 404 page (visit a garbage URL).

From now on, every push to `main` deploys production automatically, and every push to any other branch gets an isolated preview URL — use preview URLs for client review, never screenshots.

## Custom domain

1. Pages project → **Custom domains** → add `clientdomain.com` **and** `www.clientdomain.com` (Cloudflare handles the cert and redirects the secondary to the primary — make the apex primary unless the client has history on www).
2. If the domain's DNS is on Cloudflare (preferred): records are created automatically. Otherwise the client's DNS needs the CNAME records Cloudflare shows.
3. After DNS propagates, confirm `https://` works on both hostnames and that exactly one canonical hostname serves the site (the other 301s).

Domain go-live is the step most likely to involve the client's existing email (MX records) — when changing DNS at a registrar, migrate **only** the web records and leave MX/TXT untouched. Breaking a client's email during a website launch is the classic agency disaster.

## Google Analytics 4

Default on every site **unless the client targets EU/UK audiences** — GA4 sets cookies, and serving them to EU/UK visitors without a consent banner isn't compliant. If the client targets EU/UK, tell the user and let them choose: add a consent banner that blocks GA4 until accepted, or use a cookieless analytics product for that project. Don't silently pick.

**Adding or changing analytics code is an escalation point — loop in Aaron** (Microsoft Teams
or aaron@pixelotech.com) before writing new GA4/analytics code, and get the measurement ID
from him. The snippet below is the approved shape; use it as-is rather than improvising a new
analytics integration.

For the standard (non-EU) case, in `app/layout.tsx`:

```tsx
import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// inside <body>, after {children}:
{GA_ID && (
  <>
    <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
    <Script id="ga4" strategy="afterInteractive">
      {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}');`}
    </Script>
  </>
)}
```

Because the site sets cookies via GA4, it needs a **privacy policy page** (`/privacy/`) that names Google Analytics, what it collects, and a contact for data questions. Footer links to it. This ships with the site, not after.

The `GA_ID &&` guard means missing-ID builds work (previews, pre-launch) — but a missing ID in production is a launch blocker; the readiness checklist covers it.

## Post-launch

1. Submit `https://clientdomain.com/sitemap.xml` in Google Search Console (verify the domain via DNS TXT through the company account).
2. Confirm GA4 shows the developer's own visit in Realtime.
3. Lock `main`: enable branch protection so changes go through PRs with preview deploys.

## Redeploys / updates

Any change that touches pages re-runs the readiness check (`scripts/readiness-check.mjs`) before merging to `main`. The preview URL on the PR is what you check; production follows automatically on merge.

---

© 2026 Pixelotech. All rights reserved. Proprietary — Pixelotech internal use only. See LICENSE.md. Contact: https://pixelotech.com
