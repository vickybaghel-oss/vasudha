# Blog (MDX)

Only add this when the project actually includes a blog. Posts are `.mdx` files committed to the repo and written by developers/the company's content team — there is deliberately no CMS. If a client insists on editing content themselves, that's a stack-level conversation for the user, not something to solve with a bolted-on admin panel.

## Dependencies

```bash
bun add next-mdx-remote gray-matter reading-time
```

(`next-mdx-remote`'s RSC export compiles MDX at build time — fully compatible with static export.)

## Content format

Posts live in `content/blog/<slug>.mdx`. Frontmatter is the contract — every post has all of these:

```mdx
---
title: "How Often Should You Really Get a Dental Checkup?"
description: "The evidence behind the six-month rule, and when you can stretch it."
date: "2026-07-01"
author: "Dr. Sarah Chen"
image: "/images/blog/dental-checkup.jpg"
---

Post body in MDX...
```

## Implementation

`src/lib/blog.ts` — the only file that reads the filesystem:

```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  image?: string;
};

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const { data } = matter(fs.readFileSync(path.join(BLOG_DIR, f), "utf8"));
      return { slug: f.replace(/\.mdx$/, ""), ...(data as Omit<PostMeta, "slug">) };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string) {
  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), "utf8");
  const { data, content } = matter(raw);
  return { meta: { slug, ...(data as Omit<PostMeta, "slug">) }, content };
}
```

Routes:

- `app/blog/page.tsx` — index listing from `getAllPosts()`, card per post.
- `app/blog/[slug]/page.tsx` — must export `generateStaticParams()` (static export builds only the params returned here) and `generateMetadata()` from the frontmatter. Render with `<MDXRemote source={content} />` from `next-mdx-remote/rsc`.

```tsx
export function generateStaticParams() {
  return getAllPosts().map(({ slug }) => ({ slug }));
}
```

## SEO for posts

- `generateMetadata()` maps frontmatter → title/description/OG image (fall back to the site OG image).
- Add `BlogPosting` JSON-LD on each post (headline, datePublished, author, image).
- Add blog routes to `sitemap.ts` from `getAllPosts()` — never hand-maintain the list.

## Writing standards

Posts exist to rank and convert, so each one targets one search query in the client's niche, answers it properly (800+ words of substance, not padding), and ends with a CTA section linking to the relevant service page. Author attribution must be a real person from the client's business — search engines and readers both discount anonymous content.

---

© 2026 Pixelotech. All rights reserved. Proprietary — Pixelotech internal use only. See LICENSE.md. Contact: https://pixelotech.com
