# Approved npm Packages

Every dependency on a client site is something the company then owns, updates, and is
liable for — a random npm package can carry bugs, abandonment, license traps, bloat, or
supply-chain risk. So the dependency list is deliberately small and deliberately shared:
if every site uses the same packages, one person can reason about the whole portfolio.

## The rule

**Use only the packages on the approved list below. Before adding ANY package that is not
on this list — including a transitive dependency you'd install directly, a "quick" utility,
or an alternative to something already approved — stop and get Aaron's approval first.**

- Reach Aaron via **Microsoft Teams** or **aaron@pixelotech.com**.
- When you ask, say what the package is, why the approved set can't do it, and its weekly
  downloads / last-publish / license — enough for a yes/no without a research session.
- This applies to the site's own `package.json`. Packages that shadcn's CLI pulls in
  automatically when you `add` a component are already covered (they're part of "shadcn/ui"
  below) — you don't need approval for those.
- If you're mid-build and blocked on approval, implement without the package where you can
  (most "I need a library for this" moments on a brochure site are a few lines of plain
  code), and flag the open request in the scaffold/handoff report rather than silently
  reaching for an unapproved dependency.

Agents (Claude Code, Codex) working in a project follow this same rule — the per-project
`CLAUDE.md`/`AGENTS.md` restate it so a later session can't quietly add a dependency.

## Approved list

### Core framework (always present)
| Package | Purpose |
|---|---|
| `next` | Framework (App Router, static export) |
| `react`, `react-dom` | React runtime |
| `typescript` | Language |
| `@types/node`, `@types/react`, `@types/react-dom` | Types |

### Styling & UI
| Package | Purpose |
|---|---|
| `tailwindcss`, `@tailwindcss/postcss`, `postcss` | Tailwind v4 |
| `shadcn` (CLI) + the components it generates | Component library — the only one |
| `class-variance-authority`, `clsx`, `tailwind-merge` | shadcn's styling helpers (`cn`, variants) |
| `tw-animate-css` / `tailwindcss-animate` | Animation utilities shadcn expects |
| `@base-ui-components/react` | Headless primitives shadcn builds on (see [stack-notes.md](stack-notes.md)) |
| `lucide-react` | Icon set shadcn uses |

### Fonts
Use `next/font` (built into Next — no package). No other font loader.

### Blog (only in projects with a blog)
| Package | Purpose |
|---|---|
| `next-mdx-remote` | Render MDX at build time |
| `gray-matter` | Parse post frontmatter |
| `reading-time` | "N min read" estimate |

### Forms — complex cases only
Simple contact forms use plain React state + the `src/lib/forms.ts` layer, no library. Only
for genuinely complex multi-step forms:
| Package | Purpose |
|---|---|
| `react-hook-form`, `@hookform/resolvers`, `zod` | Form state + schema validation |

### Build-time image tooling (devDependency)
| Package | Purpose |
|---|---|
| `sharp` / `sharp-cli` | Pre-optimize images and generate OG/favicon assets (see [page-building.md](page-building.md)) |

### Linting (from create-next-app)
| Package | Purpose |
|---|---|
| `eslint`, `eslint-config-next` | Linting — keep what the generator installs |

## Not approved by default — ask Aaron

These come up often and are **not** automatic — they change the site's nature or add real
weight, so they need a decision:

- Animation libraries beyond Tailwind utilities (`framer-motion`/`motion`, GSAP) — nice, but
  heavy; approve per project.
- Carousel/slider, lightbox, date-picker, charting, map SDKs — usually a sign the design
  needs a rethink or a lighter embed; check first.
- Anything that implies a backend/runtime (state managers talking to APIs, auth SDKs,
  database clients) — likely means the project doesn't fit the static-export standard at all;
  escalate before building.

---

© 2026 Pixelotech. All rights reserved. Proprietary — Pixelotech internal use only. See LICENSE.md. Contact: https://pixelotech.com
