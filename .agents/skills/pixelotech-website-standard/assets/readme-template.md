<!--
AGENT INSTRUCTIONS (delete this comment block from the generated README):
- Write this to README.md in the project root at scaffold time, all {{TOKEN}}s filled.
- Badge versions: read the REAL major versions from package.json after install
  ({{NEXT_MAJOR}}, {{TAILWIND_MAJOR}}, {{TS_MAJOR}}) — don't guess.
- {{LOGO_PATH}}: the client logo if provided (e.g. public/images/logo.svg); if only a
  placeholder exists, still reference it — the file gets replaced, the path stays.
- Keep the "Built by Pixelotech" footer and the standard/version line — this README is
  also the human-readable breadcrumb to the company standard (CLAUDE.md/AGENTS.md are
  the machine-readable ones).
-->

<p align="center">
  <img src="{{LOGO_PATH}}" alt="{{BUSINESS_NAME}}" height="60" />
</p>

<h3 align="center">{{BUSINESS_NAME}} — Website</h3>

<p align="center">
  {{ONE_LINE_SITE_DESCRIPTION}}
  <br />
  Production: <a href="{{DOMAIN}}">{{DOMAIN}}</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-{{NEXT_MAJOR}}-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Tailwind-v{{TAILWIND_MAJOR}}-38bdf8?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/TypeScript-{{TS_MAJOR}}-3178c6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/bun-runtime-f9f1e1?logo=bun&logoColor=black" alt="bun" />
</p>

---

### Tech Stack

| Layer      | Technology                                        |
| ---------- | ------------------------------------------------- |
| Framework  | Next.js {{NEXT_MAJOR}} (App Router, static export) |
| Styling    | Tailwind CSS v{{TAILWIND_MAJOR}} + shadcn/ui      |
| Language   | TypeScript {{TS_MAJOR}}                           |
| Runtime    | bun                                               |
| Hosting    | Cloudflare Pages (auto-deploy from `main`)        |
| Forms      | Pixelotech central forms API                      |

### Quick Start

```bash
bun install
bun run dev
```

Open **[localhost:3000](http://localhost:3000)** to view the site.

### Project Structure

```
src/app/           Pages (one folder per route), sitemap, robots, 404
src/components/    ui/ (shadcn) · layout/ (header, footer) · sections/ (page blocks)
src/lib/           site.ts (all business facts) · forms.ts (form submission — do not modify)
content/blog/      Blog posts (.mdx) — if this project has a blog
public/            Static assets: images, favicon, og-image, _headers
```

Business facts (name, domain, contact, nav) live **only** in `src/lib/site.ts` — edit them there, never inline in components.

### Scripts

```bash
bun run dev       # Start dev server
bun run build     # Static production build → out/
bun run lint      # Run ESLint
```

### Deploying

Push to `main` → Cloudflare Pages builds and deploys automatically. Any other branch gets a preview URL — use previews for client review. **Before merging anything to `main`**, run the production build and the Pixelotech readiness check against `out/`; failures block launch.

### Making Changes

This project follows the **Pixelotech Website Standard** (v{{STANDARD_VERSION}}) — see `CLAUDE.md` / `AGENTS.md` in this repo for the rules that must hold (static export only, forms through the central API, shadcn/ui only). Content-change requests from the client go through the Pixelotech team; there is no CMS by design.

---

<p align="center">
  <sub>Built with care by <a href="https://pixelotech.com">Pixelotech</a> · logic@pixelotech.com</sub>
</p>
