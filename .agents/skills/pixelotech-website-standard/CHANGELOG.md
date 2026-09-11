# Changelog — Pixelotech Website Standard

Versioning: semver. Bump **major** when a non-negotiable or the stack changes (existing
projects may not conform anymore), **minor** when workflow/references are added or
meaningfully changed, **patch** for fixes and wording. Update `version` and
`last_modified` in SKILL.md frontmatter with every release.

## 1.0.0 — 2026-07-14

First company-wide release.

- Stack standard: Next.js static export + TypeScript + Tailwind + shadcn/ui + bun, Cloudflare Pages (git-connected, company org/account).
- Workflow phases: onboarding (intake interview + scaffold), page-building, forms, SEO, blog (MDX), production readiness, deployment.
- Slash-command launchers ([commands/](commands/)) for the most-used steps: `/pixelotech-web-standards:new-site`, `:seo-audit`, `:production-readiness-check`. Thin launchers over the workflow (canonical under `commands/`, installed to `.claude/commands/pixelotech-web-standards/`); they don't change the phases, non-negotiables, or escalation rules.
- Onboarding scaffold generates: standard directory layout, `site.ts`/`forms.ts`, security headers, complete privacy policy at `/privacy/` (from `assets/privacy-policy-template.md`, all tokens filled at skeleton stage), per-project `CLAUDE.md` + `AGENTS.md` agent instructions, and a branded `README.md` (from `assets/readme-template.md`).
- Central forms API: flat form-encoded POST to https://form-submission.pixelotech.com/submit (`site` + `form` reserved keys, set after the field spread so user fields can't corrupt attribution). No JSON, no third-party form services.
- Automated readiness check (`scripts/readiness-check.mjs`) gating every launch: per-page SEO/a11y/placeholder checks, internal-link resolution, image budgets, third-party form-service detection, unfilled-token detection (build output + project-root agent files), privacy-page-with-GA enforcement. Plus a human production checklist.
- GA4 default with EU/UK consent decision rule; sites otherwise cookie-free, no consent banners.
- Approved npm package list ([references/approved-packages.md](references/approved-packages.md)); any package beyond it needs Aaron's approval first.
- Escalation model: contact Aaron (Microsoft Teams / aaron@pixelotech.com) before adding unapproved packages, writing GA4/analytics code, creating the repo, setting up Cloudflare Pages, or configuring domain/DNS — and to obtain any missing forms-API or GA4 values. Restated in per-project CLAUDE.md/AGENTS.md.
- Microsoft Teams escalation channel: bundled `scripts/notify-aaron.mjs` posts an Adaptive Card (`assets/teams-escalation-card.json`) to Aaron's Teams channel, auto-collecting host/OS/runtime/project/git context. On a trigger, the agent asks the developer before notifying; suspected misuse is reported silently (`--type abuse --silent`). Supports `--dry-run`; exits non-zero on webhook error but never blocks a build.
- Stack notes ([references/stack-notes.md](references/stack-notes.md)) for current Next.js 16 / shadcn Base UI gotchas, plus bundled `scripts/postbuild.mjs` (prunes Next's duplicate 404 route dirs); readiness check flags when postbuild wasn't run.
- Working discipline: use superpowers skills (brainstorming, systematic-debugging, verification-before-completion) alongside this standard when available.
- Proprietary license (LICENSE.md); developer escalation contact Aaron (aaron@pixelotech.com), licensing contact logic@pixelotech.com.

---

© 2026 Pixelotech. All rights reserved. Proprietary — Pixelotech internal use only. See LICENSE.md.
