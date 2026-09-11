# Building Pages

## Composition model

Pages are thin; sections do the work. Each `app/<route>/page.tsx` exports metadata and stacks section components:

```tsx
import { Hero } from "@/components/sections/hero";
import { ServicesGrid } from "@/components/sections/services-grid";
import { CtaBanner } from "@/components/sections/cta-banner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <CtaBanner />
    </>
  );
}
```

Why: sections are what get reused and rearranged when the client asks for changes ("move the testimonials above the pricing"). Keeping them self-contained in `components/sections/` means those requests are five-minute jobs.

Keep components as **server components by default**. Add `"use client"` only where there's real interactivity (forms, mobile nav toggle, carousels). Every client component ships JS to the visitor; a brochure site should ship almost none.

## Theming shadcn to the brand

All brand styling flows through the CSS variables in `globals.css`:

1. Set `--primary`, `--secondary`, `--accent`, `--radius`, etc. from the client's brand colors (use oklch/hsl per the shadcn version's convention already in the file).
2. Check contrast as you go: `--primary-foreground` on `--primary` must meet WCAG AA (4.5:1 for text). Client brand colors are often too light for white text — darken the variable, not the design.
3. Fonts via `next/font/google` in `layout.tsx` (self-hosted at build time, no request to Google at runtime — works fully with static export):

```tsx
import { Inter, Playfair_Display } from "next/font/google";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const serif = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
```

Never hardcode brand colors in components (`bg-[#3b82f6]`). If the client rebrands, we change variables in one file, not fifty class strings.

## Design input

Designs may arrive as Figma files/exports, screenshots, reference sites, or just a verbal brief. Whatever the source:

- With provided designs: match them faithfully — spacing, type scale, color. The designer's file wins over your instincts.
- From a brief only: establish a type scale, a spacing rhythm, and a restrained palette *before* writing sections, and keep every section on that system. Generic-looking output is the main failure mode; distinctive fonts, a real color point of view, and generous whitespace are the cheapest fixes.

## Images under static export

There is no runtime image optimizer (`images.unoptimized = true`), so optimization is a build-input discipline:

1. **Pre-optimize every image before it enters `public/images/`.** Resize to the largest size actually displayed (hero ≤ 1920px wide, cards ≤ 800px), convert photos to WebP quality ~80. `bunx sharp-cli` or any tool is fine.
2. Budget: photos ≤ 200KB, hero images ≤ 350KB. The readiness check flags oversized files.
3. Still use `next/image` with explicit `width`/`height` (prevents layout shift) and `priority` on the LCP/hero image only.
4. Every `<Image>`/`<img>` gets a real `alt` (or `alt=""` if purely decorative). This is both accessibility and SEO.
5. Logos and icons: SVG, inline or from `public/`.

## Baseline every page must meet

- Exactly one `<h1>`, heading levels don't skip (h1 → h2 → h3).
- Semantic landmarks: `<header>`, `<main>`, `<footer>`, `<nav>` — once each per page.
- All interactive elements reachable by keyboard; visible focus states (shadcn's defaults are good — don't remove focus rings).
- Responsive at 375px, 768px, 1440px. Check all three, not just desktop; most brochure-site traffic is mobile.
- Internal links use trailing slashes (`/about/`) to match `trailingSlash: true`.
- A styled `not-found.tsx` with navigation back to home — Cloudflare serves it as the site's 404 page.
- No lorem ipsum, no placeholder stock-photo URLs, no TODO text in anything a client might see. If real copy doesn't exist yet, write plausible copy from the brief and flag it for client review.

---

© 2026 Pixelotech. All rights reserved. Proprietary — Pixelotech internal use only. See LICENSE.md. Contact: https://pixelotech.com
