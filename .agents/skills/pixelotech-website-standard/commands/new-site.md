---
description: Start a new Pixelotech client site — intake interview then scaffold (Phase 0–1)
argument-hint: [client name or one-line brief]
---

Use the `pixelotech-website-standard` skill, then execute Phases 0–1 by reading and following
`references/new-project-onboarding.md` (which orchestrates `references/project-setup.md`).

Starting context from the developer (may be empty): $ARGUMENTS

Do this:

1. Run the **one-batch intake interview** exactly as the onboarding doc defines it (client facts,
   domain, project path, pages, brand, GA4, EU/UK audience). Fold anything already provided in the
   context above into the questions so you don't re-ask it.
2. For any answer that's missing, follow the onboarding doc's placeholder rule — track it, never
   invent a fact — and list open items in the scaffold/handoff report at the end.
3. Run the automated scaffold on the latest package versions per `references/project-setup.md`
   (create-next-app flags, static-export `next.config.ts`, shadcn init, standard directory layout,
   security headers, `.env` conventions).
4. If an intake answer is one of the escalation items (GA4 ID, repo creation, Cloudflare project,
   forms-API values, domain/DNS), don't block — keep building and list it in the scaffold/handoff
   report as an item to raise with Aaron (see the skill's Escalation section).

Use `superpowers:brainstorming` before locking design direction if the brief is open-ended.
