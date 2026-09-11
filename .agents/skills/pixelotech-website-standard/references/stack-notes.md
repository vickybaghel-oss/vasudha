# Stack Notes — Known Issues & Fixes

Version-specific gotchas we've hit on this stack, with the fix we standardized on. These
are things the framework docs won't warn you about but that every project on current
Next.js/shadcn versions runs into. Read this during scaffold (project-setup.md points here)
so you don't rediscover them the hard way. When a new one bites you, add it here — that's
how the standard stays ahead of the tooling.

## Next.js 16 — 404 page emitted three times

`next build` with `output: "export"` writes the 404 page as `out/404.html` **and** as two
dead route directories, `out/404/index.html` and `out/_not-found/index.html`. Cloudflare
Pages only needs `404.html`; the directory duplicates are crawlable dead routes that share
the homepage `<title>` and fail the readiness check.

**Fix (standard):** run the bundled `scripts/postbuild.mjs` after every build. Copy it into
the project's `scripts/` at scaffold and wire the build script:

```json
"scripts": {
  "build": "next build && node scripts/postbuild.mjs"
}
```

It prunes the two directory duplicates and keeps `404.html`. Idempotent — safe if a future
Next version stops emitting them.

## Next.js 16 — Turbopack build can panic on Windows with long output paths

Next 16 uses Turbopack for `next build` by default. On Windows, when the project's absolute
output path is very long/deep, the build can panic (a `MAX_PATH` limit issue), not from
anything wrong in your code.

**Fix:** first try relocating the project to a shorter path (e.g. `C:\dev\<project>`). If
that's not practical, fall back to the webpack builder for that project:

```json
"build": "next build --webpack && node scripts/postbuild.mjs"
```

Only reach for `--webpack` when you actually hit the panic — Turbopack is faster and is the
default for good reason. Note the choice in the project README so the next developer knows
why it's there.

## shadcn/ui — components now build on Base UI, not Radix `asChild`

Current shadcn/ui ships components built on **Base UI** primitives. The old Radix
`asChild` prop pattern for composing a component with a link is gone. To render a shadcn
`Button` as a Next `Link`, use the `render` prop, or apply `buttonVariants()` classes to the
link directly:

```tsx
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

// Preferred — render prop:
<Button render={<Link href="/contact/" />}>Contact us</Button>

// Or style the link directly:
<Link href="/contact/" className={buttonVariants({ variant: "default" })}>Contact us</Link>
```

If you see a TypeScript error about `asChild` not existing on a shadcn component, this is
why — reach for `render` / `buttonVariants()` instead of downgrading shadcn.

---

© 2026 Pixelotech. All rights reserved. Proprietary — Pixelotech internal use only. See LICENSE.md. Contact: https://pixelotech.com
