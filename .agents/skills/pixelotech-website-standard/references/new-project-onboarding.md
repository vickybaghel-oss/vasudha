# New Project Onboarding

Use this flow whenever a developer starts a brand-new client website. It has two halves: a short **intake interview** that collects every fact the scaffold needs, then an **automated scaffold** that turns the answers into a building, deployable skeleton. The goal: a developer answers a handful of questions once, and five minutes later has a project that builds clean, follows the standard layout, and is ready for real page-building — with nothing to configure by hand afterwards.

## Step 1 — Intake interview

Ask the developer for the items below **in one batch** (use a structured multi-question prompt if the environment supports it; otherwise one compact message). Don't drip-feed questions one at a time, and don't ask for anything already given in the task or discoverable from provided files.

| # | Question | Required? | Default if unanswered |
|---|----------|-----------|----------------------|
| 1 | Client/business name | yes | — |
| 2 | Production domain | yes | — (drives project name, canonical URLs, JSON-LD) |
| 3 | Where to create the project (parent directory path) | yes | current working directory |
| 4 | Business type + full address, phone, email | yes | — (drives JSON-LD schema type and contact page) |
| 5 | Page list | no | Home, Services, About, Contact |
| 6 | Blog needed? | no | no |
| 7 | Brand: primary color, font preferences, logo file if available | no | ask for at least a primary color; fonts default to a clean sans pairing |
| 8 | GA4 measurement ID | no | mark "pending" — launch blocker, not build blocker |
| 9 | Does the client target EU/UK audiences? | yes | — (consent decision; see deployment.md) |
| 10 | Anything nonstandard? (booking embeds, maps, integrations) | no | none |

Project name is derived, not asked: domain without TLD, kebab-case (`brightsmiledental.com` → `brightsmile-dental`).

If the developer answers "don't know yet" to a required item, proceed with a clearly-marked placeholder and record it in the scaffold report (Step 3) as an open item — never silently invent a domain or address, since those flow into SEO and structured data.

## Step 2 — Scaffold

Execute in order. Full technical detail for each item lives in [project-setup.md](project-setup.md) — read it first; this is the orchestration order:

1. **Create the app** in the chosen parent directory with `bun create next-app@latest` (per project-setup.md §1). `@latest` is deliberate: every new project starts on current versions of Next.js, Tailwind, and tooling. Never pin to an old major to match a previous project, and don't downgrade anything the generator produced. After scaffolding, `bun update` is allowed to pull current minors; upgrades beyond what `@latest` produced are not required.
2. **Static export config** — replace `next.config.ts` (project-setup.md §2).
3. **Build script + postbuild** — copy `scripts/postbuild.mjs` from the skill into the project and set `"build": "next build && node scripts/postbuild.mjs"` (project-setup.md §3b). This prunes Next 16's duplicate 404 routes so the readiness check passes.
4. **shadcn/ui init** with `bunx --bun shadcn@latest init`, then add only the components the page list needs (§3). Everything installed so far is on the approved list — don't add packages beyond [approved-packages.md](approved-packages.md) without Aaron's approval.
5. **Directory layout** — create the standard folders, including empty ones (§4).
6. **Generate `src/lib/site.ts`** from the interview answers: name, domain, description, phone, email, address, and a `nav` array built from the page list (§5).
7. **Copy `src/lib/forms.ts`** verbatim from [forms.md](forms.md).
8. **`public/_headers`** security headers (§6), **`.env.example`** with `NEXT_PUBLIC_GA_ID` (§7), and `.env.local` with the real GA4 ID if provided.
9. **Root layout**: fonts via `next/font/google`, header/footer wired to `site.nav`, JSON-LD component with the schema type matching the business (see [seo.md](seo.md) §4), GA4 snippet guarded behind the env var (see [deployment.md](deployment.md)) — but only after the EU/UK answer is settled, and loop in Aaron before writing new analytics code.
10. **Page stubs**: one route folder per page from the page list, each with real `metadata` (unique title/description from the business facts — placeholders here leak into search results) and a minimal hero section so every route renders something sensible. `not-found.tsx`, `sitemap.ts`, `robots.ts` included. If blog = yes, add the blog structure from [blog.md](blog.md) with one example post marked as a draft to delete.
11. **Privacy policy page** at `/privacy/`, generated from `assets/privacy-policy-template.md` with **every** `{{TOKEN}}` filled from the intake answers (effective date = today). This page ships *complete* at skeleton stage — no pending variables, no "coming soon" — because it's legally required from the moment GA4 goes live, and "we'll write it later" pages have a habit of launching. Link it in the footer. Include `/privacy/` in the sitemap and nav-adjacent footer only (not main nav).
12. **Agent instruction files**: write `CLAUDE.md` and `AGENTS.md` (identical content) to the project root from `assets/project-agent-instructions.md`, tokens filled. These are what make the standard stick after handoff — any Claude Code or Codex session opened in this repo months later reads them and follows the standard instead of improvising. They are part of the scaffold, not optional.
13. **README**: generate `README.md` from `assets/readme-template.md`, all tokens filled (badge versions read from `package.json`, not guessed). This is the human-facing counterpart to the agent files — the first thing a developer sees when opening the repo, telling them the stack, structure, scripts, and that the Pixelotech standard governs changes.
14. **Brand theming**: set the shadcn CSS variables in `globals.css` from the brand answers (see [page-building.md](page-building.md)) and drop the logo into `public/` if provided. Generate a simple brand-colored favicon and `og-image.jpg` placeholder if no assets were given, and flag both as items for design.
15. **Git init** + first commit. Do not create the GitHub repo or touch Cloudflare yet — that's Phase 7 (deployment); repo creation and Cloudflare setup go through Aaron.

## Step 3 — Verify and report

1. `bun run build` must succeed and produce `out/`.
2. Run the readiness check against it: `node <skill>/scripts/readiness-check.mjs out --domain <domain>`. At skeleton stage, content-level findings (thin copy, placeholder OG image) are expected — structural findings (missing sitemap, missing canonical, broken nav links, missing 404) are not; fix those before handing over.
3. Give the developer a short scaffold report: project path, what was generated, the exact readiness output, and the open-items list (pending GA4 ID, placeholder assets, unanswered interview items). This report is the handoff point where skeleton ends and page-building (Phase 2 of SKILL.md) begins.

---

© 2026 Pixelotech. All rights reserved. Proprietary — Pixelotech internal use only. See LICENSE.md. Contact: https://pixelotech.com
