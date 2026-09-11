# Project Setup

## 1. Create the project

Project name = client's domain without TLD, kebab-case (e.g. `brightsmile-dental` for brightsmiledental.com).

```bash
bun create next-app@latest <project-name> --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd <project-name>
```

If create-next-app prompts for anything anyway, answer: TypeScript **yes**, ESLint **yes**, Tailwind **yes**, `src/` directory **yes**, App Router **yes**, import alias **@/**. Decline anything not listed here (no Turbopack opinion needed — dev default is fine).

Everything the generator installs is on the approved dependency list. **Do not add packages beyond [references/approved-packages.md](approved-packages.md) without Aaron's approval** (Microsoft Teams or aaron@pixelotech.com) — that list is the whole story on what may go into a client `package.json`.

## 2. Configure static export

Replace `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
```

Why each line matters:
- `output: "export"` — the entire standard rests on this. `bun run build` emits plain HTML/CSS/JS into `out/`, which is what Cloudflare Pages serves.
- `trailingSlash: true` — every page becomes `route/index.html`, so URLs resolve identically on Cloudflare and in local preview, and there are no `/about` vs `/about/` duplicate-content issues for SEO.
- `images: { unoptimized: true }` — the Next.js image optimizer is a server feature and doesn't exist in static export. We still use `next/image` for layout/lazy-loading, but files must be pre-optimized by hand — see [page-building.md](page-building.md).

## 3. Initialize shadcn/ui

```bash
bunx --bun shadcn@latest init
```

Pick the defaults (style: default, base color: neutral, CSS variables: yes). Then add components **as needed, not all at once** — unused components are dead code a future dev has to reason about:

```bash
bunx --bun shadcn@latest add button card input textarea label
```

Brand theming happens by editing the CSS variables in `src/app/globals.css` (`--primary`, `--radius`, etc.) — not by hardcoding colors in components. See [page-building.md](page-building.md).

Current shadcn ships components built on **Base UI**, not the old Radix `asChild` pattern. To render a `Button` as a link, use the `render` prop or `buttonVariants()` — see [stack-notes.md](stack-notes.md). If you hit an `asChild` type error, that's the cause; don't downgrade shadcn to work around it.

## 3b. Build script + postbuild

Set the project's `build` script so every build cleans up after Next's static export:

```json
"scripts": {
  "build": "next build && node scripts/postbuild.mjs"
}
```

Copy `scripts/postbuild.mjs` from this skill into the project's `scripts/`. It removes the
duplicate 404 route directories Next 16 emits (`out/404/`, `out/_not-found/`) while keeping
`out/404.html` — see [stack-notes.md](stack-notes.md) for why. If a build ever panics on
Windows over a long path, that same doc has the `--webpack` fallback.

## 4. Standard directory layout

This layout is identical on every company project. Create the folders now, even the ones that start empty:

```
<project-name>/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout: fonts, header, footer, GA4
│   │   ├── page.tsx            # Home
│   │   ├── globals.css         # Tailwind + shadcn theme variables
│   │   ├── sitemap.ts          # Generated sitemap (see seo.md)
│   │   ├── robots.ts           # Generated robots.txt (see seo.md)
│   │   ├── not-found.tsx       # Custom 404 (required)
│   │   ├── privacy/page.tsx    # Privacy policy — generated complete at scaffold (see new-project-onboarding.md)
│   │   ├── about/page.tsx      # One folder per page
│   │   └── ...
│   ├── components/
│   │   ├── ui/                 # shadcn components (managed by CLI, customize freely)
│   │   ├── layout/             # header.tsx, footer.tsx, nav
│   │   └── sections/           # Page sections: hero.tsx, services-grid.tsx, cta.tsx, contact-form.tsx
│   └── lib/
│       ├── utils.ts            # shadcn's cn() helper
│       ├── site.ts             # Site config: name, domain, contact info, nav links
│       └── forms.ts            # Forms API layer (see forms.md)
├── scripts/
│   └── postbuild.mjs           # Prunes Next's duplicate 404 routes (copied from skill)
├── content/
│   └── blog/                   # .mdx posts, only if project has a blog
├── public/
│   ├── images/                 # Pre-optimized images
│   ├── favicon.ico
│   ├── og-image.jpg            # 1200x630 default social image
│   └── _headers                # Cloudflare security headers (below)
├── CLAUDE.md                   # Agent instructions (Claude Code) — generated at scaffold
├── AGENTS.md                   # Agent instructions (Codex etc.) — identical content
├── README.md                   # Generated from assets/readme-template.md at scaffold
├── next.config.ts
└── .env.local                  # Local-only values; never committed
```

## 5. Site config

Every project has `src/lib/site.ts` as the single source of truth for facts used across pages, SEO, and JSON-LD. Nothing else in the codebase hardcodes the domain, phone number, or address:

```ts
export const site = {
  name: "BrightSmile Dental",
  domain: "https://brightsmiledental.com", // no trailing slash
  description: "Family dentist in Austin, TX ...",
  phone: "+1-512-555-0100",
  email: "hello@brightsmiledental.com",
  address: {
    street: "123 Main St",
    city: "Austin",
    region: "TX",
    postalCode: "78701",
    country: "US",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services/" },
    { label: "About", href: "/about/" },
    { label: "Contact", href: "/contact/" },
  ],
} as const;
```

## 6. Security headers

Static sites have almost no attack surface, but response headers are still on us (not WordPress's problem anymore — ours). Create `public/_headers` (Cloudflare Pages picks it up automatically):

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

Add `geolocation=(self)` instead only if the site embeds a map that needs it.

## 7. Environment variables

Static export means **every env var ends up baked into public JS** — there are no server secrets. Only `NEXT_PUBLIC_*` vars are used, and nothing secret ever goes in them:

- `NEXT_PUBLIC_GA_ID` — GA4 measurement ID (e.g. `G-XXXXXXX`)

Set them in `.env.local` for dev and in the Cloudflare Pages project settings for builds. Commit a `.env.example` listing the names with placeholder values so the next developer knows what to set.

**Writing or changing the GA4 / analytics snippet is an escalation point — loop in Aaron** (Microsoft Teams or aaron@pixelotech.com) before adding new analytics code, and get the measurement ID from him if you don't have it. Analytics touches cookies, consent, and the client's data, so it's not a solo decision — see [escalation in SKILL.md](../SKILL.md#escalation--when-to-reach-aaron).

## 8. Verify the scaffold

Before building any pages, prove the pipeline works end to end:

```bash
bun run build
```

It must complete without errors and produce `out/index.html`. If the build fails here, fix it now — every later phase assumes a working static build.

---

© 2026 Pixelotech. All rights reserved. Proprietary — Pixelotech internal use only. See LICENSE.md. Contact: https://pixelotech.com
