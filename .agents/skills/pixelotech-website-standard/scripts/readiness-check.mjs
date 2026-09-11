#!/usr/bin/env node
/**
 * Pixelotech production-readiness check for static-exported Next.js sites.
 * © 2026 Pixelotech. All rights reserved. Proprietary — see LICENSE.md.
 *
 * Usage:
 *   node readiness-check.mjs <outDir> [--domain https://clientdomain.com]
 *
 * Scans the build output (`out/`) — the thing that actually ships — rather
 * than source code. Exit code 1 if any FAIL is found.
 * No dependencies; runs with plain Node 18+ (or bun).
 */

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const outDir = args.find((a) => !a.startsWith("--")) ?? "out";
const domainIdx = args.indexOf("--domain");
const domain = domainIdx !== -1 ? (args[domainIdx + 1] ?? "").replace(/\/$/, "") : null;

const results = { FAIL: [], WARN: [], PASS: [] };
const fail = (msg) => results.FAIL.push(msg);
const warn = (msg) => results.WARN.push(msg);
const pass = (msg) => results.PASS.push(msg);

if (!fs.existsSync(outDir) || !fs.statSync(outDir).isDirectory()) {
  console.error(`Build output directory not found: ${outDir} — run \`bun run build\` first.`);
  process.exit(1);
}

// ---------- collect files ----------
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}
const allFiles = walk(outDir);
const rel = (p) => path.relative(outDir, p).split(path.sep).join("/");
const htmlFiles = allFiles.filter((f) => f.endsWith(".html"));
const pageFiles = htmlFiles.filter((f) => rel(f) !== "404.html");

// ---------- helpers ----------
const read = (f) => fs.readFileSync(f, "utf8");

function getMeta(html, attr, value) {
  // matches <meta ... name="description" ... content="..."> in either attribute order
  const re = new RegExp(
    `<meta\\s[^>]*${attr}=["']${value}["'][^>]*>`,
    "i"
  );
  const tag = html.match(re)?.[0];
  if (!tag) return null;
  return tag.match(/content=["']([^"']*)["']/i)?.[1] ?? "";
}

function pageUrl(f) {
  // out/about/index.html -> /about/ ; out/index.html -> /
  const r = rel(f);
  if (r === "index.html") return "/";
  return "/" + r.replace(/index\.html$/, "").replace(/\.html$/, "/");
}

// ---------- site-wide files ----------
const expectFile = (name, level, why) => {
  if (allFiles.some((f) => rel(f) === name)) pass(`${name} present`);
  else results[level].push(`${name} missing — ${why}`);
};
expectFile("index.html", "FAIL", "no homepage in build output");
expectFile("404.html", "FAIL", "add a styled not-found.tsx; Cloudflare serves this for bad URLs");
expectFile("sitemap.xml", "FAIL", "add src/app/sitemap.ts (see seo.md)");
expectFile("robots.txt", "FAIL", "add src/app/robots.ts (see seo.md)");
expectFile("favicon.ico", "FAIL", "every site ships a brand favicon");
expectFile("_headers", "WARN", "security headers file (see project-setup.md §6)");
expectFile("og-image.jpg", "WARN", "default social-share image expected at /og-image.jpg (any og:image works if pages point elsewhere)");

if (allFiles.some((f) => rel(f) === "robots.txt")) {
  const robots = read(path.join(outDir, "robots.txt"));
  if (/sitemap:/i.test(robots)) pass("robots.txt references sitemap");
  else warn("robots.txt does not reference the sitemap");
}

// ---------- Next 16 duplicate-404 route artifacts ----------
// If postbuild.mjs didn't run, Next leaves /404/ and /_not-found/ route dirs that
// otherwise surface below as confusing duplicate-title failures. Flag the real cause.
const dup404 = ["404/index.html", "_not-found/index.html"].filter((r) =>
  allFiles.some((f) => rel(f) === r)
);
if (dup404.length) {
  fail(`duplicate 404 route(s) in output (${dup404.map((r) => "/" + r.replace(/index\.html$/, "")).join(", ")}) — run scripts/postbuild.mjs after the build (see stack-notes.md)`);
}
// Don't double-report these as page failures below.
const skipRoutes = new Set(["404/index.html", "_not-found/index.html"]);

// ---------- per-page checks ----------
const titles = new Map(); // title -> [pages]
const descriptions = new Map();

for (const f of pageFiles) {
  if (skipRoutes.has(rel(f))) continue;
  const url = pageUrl(f);
  const html = read(f);

  // lang
  if (!/<html[^>]+lang=/i.test(html)) fail(`${url}: <html> missing lang attribute`);

  // viewport
  if (!getMeta(html, "name", "viewport")) fail(`${url}: missing viewport meta`);

  // title
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "";
  if (!title) fail(`${url}: missing <title>`);
  else {
    if (title.length > 70) warn(`${url}: title is ${title.length} chars (> 70 gets truncated in search results): "${title}"`);
    titles.set(title, [...(titles.get(title) ?? []), url]);
  }

  // meta description
  const desc = getMeta(html, "name", "description");
  if (desc === null) fail(`${url}: missing meta description`);
  else {
    if (desc.length < 50 || desc.length > 160)
      warn(`${url}: meta description is ${desc.length} chars (aim for 50–160)`);
    descriptions.set(desc, [...(descriptions.get(desc) ?? []), url]);
  }

  // canonical
  const canonical = html.match(/<link\s[^>]*rel=["']canonical["'][^>]*>/i)?.[0];
  if (!canonical) fail(`${url}: missing canonical link`);
  else if (domain && !canonical.includes(domain))
    fail(`${url}: canonical does not point at ${domain} — check metadataBase / site.ts domain`);

  // Open Graph
  for (const prop of ["og:title", "og:image"]) {
    if (!getMeta(html, "property", prop)) fail(`${url}: missing ${prop}`);
  }
  if (!getMeta(html, "property", "og:description") && !getMeta(html, "name", "description"))
    warn(`${url}: no og:description`);

  // h1 count (crude but effective: count h1 opening tags)
  const h1s = (html.match(/<h1[\s>]/gi) ?? []).length;
  if (h1s === 0) fail(`${url}: no <h1>`);
  else if (h1s > 1) fail(`${url}: ${h1s} <h1> elements (must be exactly one)`);

  // img alt
  const imgs = html.match(/<img\s[^>]*>/gi) ?? [];
  const missingAlt = imgs.filter((t) => !/\salt=/i.test(t)).length;
  if (missingAlt) fail(`${url}: ${missingAlt} <img> tag(s) missing alt attribute`);

  // placeholder / leftover content
  for (const [re, label] of [
    [/lorem ipsum/i, "lorem ipsum"],
    [/localhost:\d+/i, "localhost URL"],
    [/YOUR-FORMS-API/i, "placeholder forms endpoint"],
    [/TODO\(company\)/i, "TODO(company) marker"],
    // Note: a page that legitimately displays literal {{UPPERCASE}} text (e.g. an
    // article about templating) will false-positive here — rework the copy or
    // HTML-escape the braces rather than weakening this check.
    [/\{\{[A-Z0-9_]+\}\}/, "unfilled {{TOKEN}} from a company template"],
  ]) {
    if (re.test(html)) fail(`${url}: contains ${label}`);
  }

  // internal link resolution (root-relative links only)
  const hrefs = [...html.matchAll(/href=["'](\/[^"'#?]*)/g)].map((m) => m[1]);
  for (const href of new Set(hrefs)) {
    if (href.startsWith("/_next/")) continue;
    const clean = href.replace(/\/$/, "");
    const candidates = [
      clean === "" ? "index.html" : `${clean.slice(1)}/index.html`,
      `${clean.slice(1)}.html`,
      clean.slice(1), // literal file e.g. /og-image.jpg, /sitemap.xml
    ];
    if (!candidates.some((c) => allFiles.some((f2) => rel(f2) === c)))
      fail(`${url}: internal link ${href} resolves to nothing in the build output`);
  }
}

// duplicate titles/descriptions
for (const [t, pages] of titles) if (pages.length > 1) fail(`duplicate <title> "${t}" on: ${pages.join(", ")}`);
for (const [d, pages] of descriptions) if (pages.length > 1) warn(`duplicate meta description on: ${pages.join(", ")}`);

// JSON-LD on homepage
const indexFile = pageFiles.find((f) => rel(f) === "index.html");
if (indexFile) {
  if (/application\/ld\+json/.test(read(indexFile))) pass("JSON-LD structured data present on homepage");
  else fail("homepage has no JSON-LD structured data (see seo.md §4)");
}

// privacy policy page — legally required whenever analytics cookies are in play
const hasPrivacyPage = pageFiles.some((f) => /^privacy\/index\.html$|^privacy\.html$/.test(rel(f)));
const usesGA = pageFiles.some((f) => /googletagmanager\.com|gtag\(/.test(read(f)));
if (hasPrivacyPage) pass("privacy policy page present");
else if (usesGA) fail("site loads Google Analytics but has no /privacy/ page (required — see deployment.md)");
else warn("no /privacy/ page found — required before GA4 is enabled");

// ---------- JS bundles: forms endpoint sanity ----------
const jsFiles = allFiles.filter((f) => f.endsWith(".js"));
const COMPANY_FORMS = "form-submission.pixelotech.com";
let sawCompanyEndpoint = false;
for (const f of jsFiles) {
  const js = read(f);
  if (js.includes(COMPANY_FORMS)) sawCompanyEndpoint = true;
  if (/YOUR-FORMS-API|TODO\(company\)/.test(js))
    fail(`JS bundle ${rel(f)}: stale placeholder from an old template — update src/lib/forms.ts`);
  for (const bad of ["formspree.io", "emailjs.com", "getform.io", "usebasin.com"])
    if (js.includes(bad)) fail(`JS bundle ${rel(f)}: form wired to third-party service ${bad} — all forms must use the company API (see forms.md)`);
}
const hasFormMarkup = pageFiles.some((f) => /<form[\s>]/i.test(read(f)));
if (hasFormMarkup && !sawCompanyEndpoint)
  warn(`site contains a <form> but no JS references ${COMPANY_FORMS} — verify forms go through src/lib/forms.ts`);

// ---------- project-root files (not part of build output) ----------
// CLAUDE.md / AGENTS.md / README.md never reach out/, so scan them at the out-dir's parent.
const projectRoot = path.resolve(outDir, "..");
for (const name of ["CLAUDE.md", "AGENTS.md", "README.md"]) {
  const p = path.join(projectRoot, name);
  if (!fs.existsSync(p)) {
    warn(`${name} missing from project root — the scaffold should generate it (see new-project-onboarding.md)`);
    continue;
  }
  if (/\{\{[A-Z0-9_]+\}\}/.test(read(p))) fail(`${name}: contains unfilled {{TOKEN}} from the company template`);
  else pass(`${name} present and token-free`);
}

// ---------- image weight ----------
for (const f of allFiles.filter((f) => /\.(jpe?g|png|webp|avif|gif)$/i.test(f))) {
  const kb = Math.round(fs.statSync(f).size / 1024);
  if (kb > 500) fail(`${rel(f)} is ${kb}KB (> 500KB — resize/compress, see page-building.md)`);
  else if (kb > 200) warn(`${rel(f)} is ${kb}KB (> 200KB budget for photos)`);
}

// ---------- report ----------
const c = { FAIL: "\x1b[31m", WARN: "\x1b[33m", PASS: "\x1b[32m", reset: "\x1b[0m" };
console.log(`\nReadiness check on ${outDir} (${pageFiles.length} pages)${domain ? ` for ${domain}` : ""}\n`);
for (const level of ["FAIL", "WARN"]) {
  for (const msg of results[level]) console.log(`  ${c[level]}${level}${c.reset}  ${msg}`);
}
console.log(
  `\n  ${c.PASS}${results.PASS.length} passed${c.reset}, ${c.WARN}${results.WARN.length} warnings${c.reset}, ${c.FAIL}${results.FAIL.length} failures${c.reset}\n`
);
if (!domain) console.log("  Tip: pass --domain https://clientdomain.com to verify canonical URLs.\n");
if (results.FAIL.length) {
  console.log("  Not ready to launch. Fix the failures above and re-run.\n");
  process.exit(1);
}
console.log("  Automated checks passed. Now walk references/production-checklist.md with the user.\n");
