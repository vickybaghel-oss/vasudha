# SEO

The full package below ships on **every** site — it's a core deliverable clients pay for, not an add-on. Everything here works with static export because it's all generated at build time.

## 1. Root metadata (`app/layout.tsx`)

```tsx
import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `${site.name} — Family Dentist in Austin, TX`, // pattern: Brand — primary keyword + location
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    images: ["/og-image.jpg"],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "./" }, // per-page canonical, resolved against metadataBase
};
```

`metadataBase` + `alternates.canonical: "./"` gives every page a correct self-referencing canonical URL automatically — this is what prevents duplicate-content dilution.

## 2. Per-page metadata

Every page exports its own `metadata` with a **unique** title and description:

```tsx
export const metadata: Metadata = {
  title: "Teeth Whitening & Cosmetic Dentistry", // template appends "| BrightSmile Dental"
  description: "Professional teeth whitening in Austin ...", // 50–160 chars, includes the page's target keyword naturally
};
```

Rules of thumb:
- Title ≤ 60 chars before the template suffix; put the differentiating words first.
- Description 50–160 chars, written as a click-worthy sentence, not a keyword list.
- Two pages must never share a title or description — the readiness check flags duplicates.

## 3. Sitemap and robots

`src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/services/", "/about/", "/contact/"]; // keep in sync with real pages; include blog posts if any
  return routes.map((route) => ({
    url: `${site.domain}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
```

`src/app/robots.ts`:

```ts
import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.domain}/sitemap.xml`,
  };
}
```

If the project has a blog, generate the blog routes into the sitemap from the content files rather than listing them by hand.

## 4. JSON-LD structured data

Structured data is what earns rich results (stars, business info panels, FAQ dropdowns) — local-business clients benefit the most. Add a component and render it in the root layout:

```tsx
// components/seo/json-ld.tsx
import { site } from "@/lib/site";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Dentist", // pick the MOST SPECIFIC type: Dentist, Attorney, Plumber, Restaurant... fall back to LocalBusiness, then Organization for non-local businesses
    name: site.name,
    url: site.domain,
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    image: `${site.domain}/og-image.jpg`,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

Additions when relevant: `openingHoursSpecification` (get real hours from the user), `FAQPage` schema on pages with an FAQ section, `Service` schema on service detail pages, `Article`/`BlogPosting` on blog posts (see blog.md). Only mark up content that's actually visible on the page — invisible markup risks manual penalties.

Validate with https://validator.schema.org/ or Google's Rich Results Test before launch.

## 5. OG image

Every site ships `public/og-image.jpg`: 1200×630, brand background, logo + site name legible at thumbnail size. This is what shows when anyone shares the site on WhatsApp/LinkedIn/Slack/iMessage — a missing OG image looks broken to exactly the people the client wants to impress. Static file, not runtime generation (there is no runtime).

If you have image-generation ability in the session, generate one; otherwise composite it from the logo and brand colors, or flag it as a launch blocker for design.

## 6. Content-level SEO (do this while writing copy, not after)

- One clear target query per page; it appears in the h1, title, and first paragraph naturally.
- h2s answer the sub-questions a searcher would have.
- Internal links between related pages ("Our whitening service" → `/services/whitening/`) with descriptive anchor text, never "click here".
- Real place names for local businesses — city and neighborhood in copy, not just in metadata.

---

© 2026 Pixelotech. All rights reserved. Proprietary — Pixelotech internal use only. See LICENSE.md. Contact: https://pixelotech.com
