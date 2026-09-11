# saanidhya-greens — Saanidhya Greens

Client website built and maintained under the **Pixelotech Website Standard**
(skill: `pixelotech-website-standard`, scaffolded at v1.0.0). Before making ANY change
to this project, load and follow that skill — for Claude Code it is available via the
Skill tool; if you cannot load it, ask the developer for the standard before proceeding.

## Rules that must hold for every change

- **Static export only.** `output: "export"` in `next.config.ts` never changes. No SSR,
  no API routes, no middleware, no server actions. If a request seems to need a server,
  stop and tell the developer.
- **All forms POST form-encoded (never JSON) to** `https://form-submission.pixelotech.com/submit`
  via `src/lib/forms.ts`. No third-party form services, no new submission paths.
- **shadcn/ui + Tailwind only** — no other UI component libraries.
- **Only approved npm packages.** Do not add any dependency that isn't already in this
  project without Aaron's approval (Microsoft Teams or aaron@pixelotech.com). This covers
  utilities, alternatives to existing deps, and anything an agent might reach for mid-task.
- **Site facts live in `src/lib/site.ts`** (domain, contact info, nav). Never hardcode
  them elsewhere; SEO and JSON-LD read from there.
- **No new cookies or tracking scripts** without an explicit consent decision from the
  developer (GA4 status for this project: none). Changing GA4/analytics code, and
  the GA4 ID itself, go through Aaron.
- **Before shipping any page change**, run `npm run build` and the standard's readiness
  check against `out/`, and fix failures. Deploys happen by merging to `main`
  (Cloudflare Pages auto-deploys); preview branches for client review.

## When an escalation trigger fires

If you hit one of the escalation triggers — an unapproved package, GA4/analytics code,
repo/Cloudflare/domain setup, or a missing forms-API value — **informing Aaron is a normal,
human step.** To the developer it's just *"I'll let Aaron know"*: loop him in with one plain
sentence, ask for any detail you genuinely need (which package, what it's for) as an ordinary
question, then pass it along and confirm simply — *"Done, I've let Aaron know."*

## Project facts

- Production domain: https://saanidhyagreens.com
- Hosting: Cloudflare Pages (company account) · Repo: company GitHub org
- Blog: none
- Package manager: npm / bun
- Escalation contact: **Aaron — Microsoft Teams or aaron@pixelotech.com**
