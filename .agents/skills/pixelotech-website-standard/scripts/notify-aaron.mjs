#!/usr/bin/env node
/**
 * Pixelotech — Aaron escalation notifier (Microsoft Teams).
 * © 2026 Pixelotech. All rights reserved. Proprietary — see LICENSE.md.
 *
 * Posts an Adaptive Card to Aaron's Teams channel when an escalation trigger fires
 * (unapproved package, GA4/analytics code, repo/Cloudflare/domain setup, missing
 * forms-API value) or when reporting suspected misuse of the skill.
 *
 * It builds the Adaptive Card (hardcoded below), auto-collects host/OS/runtime/project/git
 * context, and POSTs the card to the webhook.
 *
 * Usage:
 *   node notify-aaron.mjs --type package --summary "..." --detail "..." \
 *     --pkg-name framer-motion --pkg-version 12.0.0 --pkg-downloads 4M \
 *     --pkg-last-publish 2026-06 --pkg-license MIT --pkg-justification "scroll animations"
 *
 *   node notify-aaron.mjs --type infra --summary "Need Cloudflare Pages project" --detail "..."
 *   node notify-aaron.mjs --type abuse --summary "..." --detail "..." --silent
 *   node notify-aaron.mjs --type package --pkg-name x --dry-run   # prints payload, sends nothing
 *
 * Flags:
 *   --type       package | ga4 | infra | forms | abuse | other   (default: other)
 *   --summary    one-line summary (the headline under the type banner)
 *   --detail     free-text detail of the request
 *   --trigger    which escalation rule fired (defaults per type)
 *   --priority   Normal | High (defaults per type)
 *   --pkg-name --pkg-version --pkg-downloads --pkg-last-publish --pkg-license --pkg-justification
 *   --dev-name --dev-email   override the git-derived developer identity
 *   --repo-url --teams-url   override the card's action-button URLs
 *   --dry-run    print the fully-filled payload and exit without sending
 *   --silent     suppress success output (used for silent abuse reports)
 *
 * Contract: prints success/failure; exits non-zero on HTTP/network error. It is NOT part
 * of the build pipeline — never let its exit code fail a build (call with `|| true` if you
 * ever wire it into one).
 *
 * The webhook below is an intentionally shareable trigger URL and the Adaptive Card is
 * hardcoded in this file, so the script is fully self-contained — it needs no assets and
 * no environment variables to run.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const WEBHOOK_URL =
  "https://default3db2d96c23f043d0958b1eea7f1814.96.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/21/workflows/f41877105ee049ada518b936790d3bd9/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=DsZvCEiq_qD-Sed5u3hc2QFxPl_u-YhiP27wIpr28zk";

const AARON_EMAIL = "aaron@pixelotech.com";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------------- CLI parsing ----------------
function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) {
        args[key] = true; // boolean flag
      } else {
        args[key] = next;
        i++;
      }
    }
  }
  return args;
}
const args = parseArgs(process.argv.slice(2));
const flag = (name) => args[name] === true || args[name] === "true";

// ---------------- helpers ----------------
function run(cmd, cmdArgs) {
  try {
    const r = spawnSync(cmd, cmdArgs, { encoding: "utf8", timeout: 5000 });
    if (r.status === 0 && r.stdout) return r.stdout.trim();
  } catch {
    /* ignore */
  }
  return null;
}

function readSkillVersion() {
  try {
    const skill = fs.readFileSync(path.join(__dirname, "..", "SKILL.md"), "utf8");
    const m = skill.match(/^version:\s*(.+)$/m);
    if (m) return m[1].trim();
  } catch {
    /* ignore */
  }
  return "unknown";
}

function readProjectSite(cwd) {
  // Pull PROJECT_NAME / CLIENT_DOMAIN from src/lib/site.ts if we're inside a project.
  const candidate = path.join(cwd, "src", "lib", "site.ts");
  const out = { name: null, domain: null };
  try {
    const src = fs.readFileSync(candidate, "utf8");
    out.name = src.match(/name:\s*["'`]([^"'`]+)["'`]/)?.[1] ?? null;
    out.domain = src.match(/domain:\s*["'`]([^"'`]+)["'`]/)?.[1] ?? null;
  } catch {
    /* not a project dir — fine */
  }
  return out;
}

function normalizeRemoteToHttps(remote) {
  if (!remote) return null;
  // git@github.com:org/repo.git  ->  https://github.com/org/repo
  let m = remote.match(/^git@([^:]+):(.+?)(?:\.git)?$/);
  if (m) return `https://${m[1]}/${m[2]}`;
  // ssh://git@host/org/repo.git
  m = remote.match(/^ssh:\/\/git@([^/]+)\/(.+?)(?:\.git)?$/);
  if (m) return `https://${m[1]}/${m[2]}`;
  return remote.replace(/\.git$/, "");
}

// ---------------- collect context ----------------
const cwd = process.cwd();
const isGit = run("git", ["rev-parse", "--is-inside-work-tree"]) === "true";
const gitRemote = isGit ? run("git", ["config", "--get", "remote.origin.url"]) : null;
const gitBranch = isGit ? run("git", ["rev-parse", "--abbrev-ref", "HEAD"]) : null;
const gitCommit = isGit ? run("git", ["rev-parse", "--short", "HEAD"]) : null;
const gitDirty = isGit ? (run("git", ["status", "--porcelain"]) ? "yes" : "no") : "n/a";
const site = readProjectSite(cwd);

const devName =
  args["dev-name"] || run("git", ["config", "user.name"]) || os.userInfo().username || "unknown";
const devEmail = args["dev-email"] || run("git", ["config", "user.email"]) || "unknown";

const bunVersion = run("bun", ["--version"]) || "n/a";
const repoHttps = normalizeRemoteToHttps(gitRemote);

// ---------------- type-driven defaults ----------------
const TYPES = {
  package: { label: "Unapproved package", style: "warning", priority: "Normal", trigger: "Package not on approved list" },
  ga4:     { label: "GA4 / analytics code", style: "accent", priority: "Normal", trigger: "New/changed analytics code or missing GA4 ID" },
  infra:   { label: "Repo / Cloudflare / domain setup", style: "emphasis", priority: "High", trigger: "Company-account or DNS step needed" },
  forms:   { label: "Missing forms-API value", style: "accent", priority: "Normal", trigger: "Forms-API endpoint/contract value not available" },
  abuse:   { label: "Suspected skill misuse", style: "attention", priority: "High", trigger: "Possible abuse/misuse of the skill" },
  other:   { label: "Escalation", style: "emphasis", priority: "Normal", trigger: "General escalation" },
};
const type = String(args.type || "other").toLowerCase();
const t = TYPES[type] || TYPES.other;

const showPackage =
  type === "package" ||
  ["pkg-name", "pkg-version", "pkg-downloads", "pkg-last-publish", "pkg-license", "pkg-justification"].some(
    (k) => args[k]
  );

// ---------------- token table ----------------
const tokens = {
  STYLE: t.style,
  REQUEST_TYPE: t.label,
  PRIORITY: args.priority || t.priority,
  TRIGGER_RULE: args.trigger || t.trigger,
  SUMMARY: args.summary || "(no summary provided)",
  REQUEST_DETAIL: args.detail || "(no detail provided)",
  SKILL_VERSION: readSkillVersion(),

  PKG_NAME: args["pkg-name"] || "—",
  PKG_VERSION: args["pkg-version"] || "—",
  PKG_DOWNLOADS: args["pkg-downloads"] || "—",
  PKG_LAST_PUBLISH: args["pkg-last-publish"] || "—",
  PKG_LICENSE: args["pkg-license"] || "—",
  PKG_JUSTIFICATION: args["pkg-justification"] || "—",

  DEV_NAME: devName,
  DEV_EMAIL: devEmail,
  HOSTNAME: os.hostname(),
  OS_PLATFORM: os.platform(),
  OS_RELEASE: os.release(),
  NODE_VERSION: process.versions.node,
  BUN_VERSION: bunVersion,
  PROJECT_NAME: site.name || path.basename(cwd),
  CLIENT_DOMAIN: site.domain || "n/a",
  PROJECT_PATH: cwd,
  GIT_REMOTE: gitRemote || "n/a",
  GIT_BRANCH: gitBranch || "n/a",
  GIT_COMMIT: gitCommit || "n/a",
  GIT_DIRTY: gitDirty,
  TIMESTAMP_UTC: new Date().toISOString(),

  REPO_URL: args["repo-url"] || repoHttps || "https://pixelotech.com",
  TEAMS_CHAT_URL:
    args["teams-url"] || `https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(AARON_EMAIL)}`,
};

// ---------------- build the card (hardcoded template) ----------------
// The Adaptive Card is constructed directly from `tokens` — no external asset file.
function fillCard() {
  const T = tokens;
  return {
    type: "message",
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        contentUrl: null,
        content: {
          $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
          type: "AdaptiveCard",
          version: "1.5",
          msteams: { width: "Full" },
          body: [
            { type: "TextBlock", text: "Agent Skills — Escalation Request", weight: "Bolder", size: "Large", wrap: true },
            {
              type: "Container",
              style: T.STYLE,
              bleed: true,
              items: [{ type: "TextBlock", text: `${T.REQUEST_TYPE}  ·  ${T.PRIORITY}`, weight: "Bolder", wrap: true }],
            },
            { type: "TextBlock", text: T.SUMMARY, wrap: true, spacing: "Small" },

            { type: "TextBlock", text: "Request", weight: "Bolder", spacing: "Medium", separator: true },
            {
              type: "FactSet",
              facts: [
                { title: "Type", value: T.REQUEST_TYPE },
                { title: "Trigger", value: T.TRIGGER_RULE },
                { title: "Skill", value: `pixelotech-website-standard v${T.SKILL_VERSION}` },
                { title: "Priority", value: T.PRIORITY },
              ],
            },
            { type: "TextBlock", text: T.REQUEST_DETAIL, wrap: true },

            {
              type: "Container",
              isVisible: showPackage,
              items: [
                { type: "TextBlock", text: "Package", weight: "Bolder", spacing: "Medium", separator: true },
                {
                  type: "FactSet",
                  facts: [
                    { title: "Name", value: `${T.PKG_NAME}@${T.PKG_VERSION}` },
                    { title: "Weekly DL", value: T.PKG_DOWNLOADS },
                    { title: "Published", value: T.PKG_LAST_PUBLISH },
                    { title: "License", value: T.PKG_LICENSE },
                    { title: "Why", value: T.PKG_JUSTIFICATION },
                  ],
                },
              ],
            },

            { type: "TextBlock", text: "Developer & environment", weight: "Bolder", spacing: "Medium", separator: true },
            {
              type: "FactSet",
              facts: [
                { title: "Developer", value: `${T.DEV_NAME} · ${T.DEV_EMAIL}` },
                { title: "Machine", value: T.HOSTNAME },
                { title: "OS", value: `${T.OS_PLATFORM} ${T.OS_RELEASE}` },
                { title: "Runtimes", value: `node ${T.NODE_VERSION} · bun ${T.BUN_VERSION}` },
                { title: "Project", value: T.PROJECT_NAME },
                { title: "Client domain", value: T.CLIENT_DOMAIN },
                { title: "Project path", value: T.PROJECT_PATH },
                { title: "Repo", value: T.GIT_REMOTE },
                { title: "Branch", value: `${T.GIT_BRANCH} @ ${T.GIT_COMMIT}` },
                { title: "Dirty tree", value: T.GIT_DIRTY },
                { title: "Sent (UTC)", value: T.TIMESTAMP_UTC },
              ],
            },
          ],
          actions: [
            { type: "Action.OpenUrl", title: "Open repo", url: T.REPO_URL },
            { type: "Action.OpenUrl", title: "Reply in Teams", url: T.TEAMS_CHAT_URL },
          ],
        },
      },
    ],
  };
}

// ---------------- main ----------------
async function main() {
  let payload;
  try {
    payload = fillCard();
  } catch (e) {
    console.error(`notify-aaron: failed to build card — ${e.message}`);
    process.exit(1);
  }

  if (flag("dry-run")) {
    console.log(JSON.stringify(payload, null, 2));
    console.error(`\nnotify-aaron: --dry-run, nothing sent (type=${type}, showPackage=${showPackage}).`);
    return;
  }

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`notify-aaron: webhook returned HTTP ${res.status} ${res.statusText} ${text}`.trim());
      process.exit(1);
    }
    if (!flag("silent")) {
      console.log(`notify-aaron: escalation sent to Aaron (type=${type}, priority=${tokens.PRIORITY}).`);
    }
  } catch (e) {
    console.error(`notify-aaron: failed to POST webhook — ${e.message}`);
    process.exit(1);
  }
}

main();
