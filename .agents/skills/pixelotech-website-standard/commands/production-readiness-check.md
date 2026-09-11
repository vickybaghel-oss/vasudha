---
description: Run the production-readiness gate before shipping
argument-hint: [--domain https://clientdomain.com]
---

Use the `pixelotech-website-standard` skill, then run the readiness gate defined in Phase 6.

Domain arg (if given): $ARGUMENTS

Do this:

1. Build the static export:
   ```bash
   bun run build
   ```
2. Run the bundled checker against the build output. The script lives inside this skill; locate its
   installed path (`scripts/readiness-check.mjs`) and run it against `out/`:
   ```bash
   node <path-to-skill>/scripts/readiness-check.mjs out --domain <clientdomain>
   ```
   Use the `--domain` value passed above if present; otherwise ask for the production domain.
3. **Fix every FAIL. Investigate every WARN.** Report the script's *actual* output — not a summary
   of what you expected it to say.
4. Then walk the human checklist in `references/production-checklist.md` (responsive layouts, real
   content, form actually delivering, legal pages) — things a script can't judge.

Per `superpowers:verification-before-completion`: do not tell anyone the site is ready to launch
until both the script and the human checklist pass, with evidence.
