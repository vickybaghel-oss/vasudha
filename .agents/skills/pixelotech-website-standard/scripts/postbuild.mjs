#!/usr/bin/env node
/**
 * Pixelotech static-export postbuild cleanup.
 * © 2026 Pixelotech. All rights reserved. Proprietary — see LICENSE.md.
 *
 * Run after `next build` (wired into the project's build script):
 *   "build": "next build && node scripts/postbuild.mjs"
 *
 * Why this exists: Next.js (16.x) emits the 404 page THREE times into the static
 * export — `out/404.html` (which Cloudflare Pages uses as the site 404), plus route
 * directories `out/404/index.html` and `out/_not-found/index.html`. The two directory
 * variants are dead duplicate routes: they'd be crawlable, they share the homepage
 * <title>, and they trip the readiness check's duplicate-title / missing-canonical
 * rules. We keep `404.html` and remove the directory duplicates.
 *
 * Idempotent and version-tolerant: if a future Next version stops emitting these, the
 * script simply finds nothing to remove.
 */

import fs from "node:fs";
import path from "node:path";

const outDir = process.argv[2] ?? "out";

if (!fs.existsSync(outDir)) {
  console.error(`postbuild: build output '${outDir}' not found — run \`next build\` first.`);
  process.exit(1);
}

// Directory-form 404 duplicates to prune (NOT the top-level 404.html Cloudflare needs).
const pruneDirs = ["404", "_not-found"];
let removed = 0;

for (const d of pruneDirs) {
  const target = path.join(outDir, d);
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    fs.rmSync(target, { recursive: true, force: true });
    console.log(`postbuild: removed duplicate 404 route /${d}/`);
    removed++;
  }
}

if (!fs.existsSync(path.join(outDir, "404.html"))) {
  console.warn("postbuild: WARNING — out/404.html is missing; Cloudflare Pages needs it for the site 404 page.");
}

console.log(`postbuild: done (${removed} duplicate route${removed === 1 ? "" : "s"} pruned).`);
