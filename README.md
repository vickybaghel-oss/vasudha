# Saanidhya Greens

Luxury Plotted Living in Vadodara. Client website built and maintained under the **Pixelotech Website Standard** (`pixelotech-website-standard`).

## Tech Stack
- **Framework**: Next.js 15 (App Router) with static export (`output: "export"`)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui tokens
- **Hosting**: Cloudflare Pages
- **Forms**: Central Pixelotech Forms API (`src/lib/forms.ts`)

## Getting Started

```bash
# Install dependencies
npm install # or bun install

# Start dev server
npm run dev

# Production build + static export
npm run build

# Readiness check
node .agents/skills/pixelotech-website-standard/scripts/readiness-check.mjs out --domain https://vasudhaagroup.com
```
