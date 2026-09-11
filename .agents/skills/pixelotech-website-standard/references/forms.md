# Forms

All form submissions from all company websites go to the **central forms API**, which handles spam filtering, storage, and email notifications. Websites are only responsible for collecting input and POSTing it.

## The submission layer: `src/lib/forms.ts`

Every project gets this file. It is the only place in the codebase that knows the endpoint or payload shape.

```ts
// ============================================================
// COMPANY CONFIG — identical on every Pixelotech project.
// Owned by the platform team; do not change per-project.
// ============================================================
const FORMS_ENDPOINT = "https://form-submission.pixelotech.com/submit";
// ============================================================

import { site } from "@/lib/site";

export type FormSubmission = {
  /** Which form on the site: "contact", "quote", "callback", ... */
  form: string;
  /** The user-entered fields */
  fields: Record<string, string>;
};

export async function submitForm({ form, fields }: FormSubmission): Promise<{ ok: boolean }> {
  // The company API accepts classic form-encoded POSTs, NOT JSON.
  // URLSearchParams sets Content-Type: application/x-www-form-urlencoded automatically.
  // Reserved keys come AFTER the spread so they always win over user fields.
  const body = new URLSearchParams({
    ...fields,
    site: site.domain, // how the API attributes submissions to a client site
    form,
  });
  const res = await fetch(FORMS_ENDPOINT, { method: "POST", body });
  return { ok: res.ok };
}
```

The API contract is a **flat form-encoded POST** (like a plain HTML `<form method="post">`): the reserved keys `site` and `form` plus the user-entered fields at the top level. Two consequences to respect:

- Never send JSON to this endpoint — it will not be accepted.
- Don't name a user-facing input `site` or `form` — the reserved keys are set last so attribution can't be corrupted, which means a user field with those names is silently discarded. Use `name`, `email`, `phone`, `message`, etc.

Copy this file verbatim into new projects. If the API contract ever changes (encoding, keys, auth), the platform team updates this reference once and the change propagates through new projects — never improvise a different payload shape on one site.

The endpoint above is the real, current one — use it as-is. **If you're missing any forms-API value (a different endpoint, an auth token, a field the client needs that isn't covered here), get it from Aaron** (Microsoft Teams or aaron@pixelotech.com) rather than guessing or wiring the form somewhere else. See the escalation table in [SKILL.md](../SKILL.md#escalation--when-to-reach-aaron).

## The form component

Contact forms live in `components/sections/contact-form.tsx` as a client component built from shadcn primitives (`input`, `textarea`, `label`, `button`). Requirements:

- **Client-side validation before submit**: required fields, email format. Use controlled state or the browser's built-in validation — no heavy form libraries for a 4-field contact form (`react-hook-form` + `zod` is justified only for genuinely complex multi-step forms).
- **Explicit UX states**: idle → submitting (button disabled, label changes) → success (form replaced by a thank-you message) → error (inline message: "Something went wrong — please email us at {site.email}", form data preserved so the visitor can retry).
- The error state must include a fallback contact method. If the API is down, the lead should still have a way to reach the client — a dead-end error costs the client real business.
- Labels on every field (not placeholder-as-label), and errors announced next to their field.
- Keep fields minimal: name, email, phone (optional), message. Every extra field measurably reduces submissions; push back if asked to add many.

Example wiring:

```tsx
"use client";

import { useState } from "react";
import { submitForm } from "@/lib/forms";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const data = new FormData(e.currentTarget);
    const { ok } = await submitForm({
      form: "contact",
      fields: Object.fromEntries(data) as Record<string, string>,
    }).catch(() => ({ ok: false }));
    setStatus(ok ? "success" : "error");
  }
  // ... render shadcn fields + states per the requirements above
}
```

## What sites do NOT do

- No third-party form services — no Formspree, EmailJS, Netlify Forms, getform, Basin, or a custom Worker. A form outside the central API is invisible to the company and its deliverability/spam guarantees, and the readiness check fails builds that reference these services.
- No spam countermeasures in the site (no CAPTCHA, no honeypot) — the central API owns spam filtering. Adding client-side friction hurts conversion without adding protection the API doesn't already have.
- No email sending, no mailto-based "forms", no storing submissions in localStorage.
- No file uploads through the standard form path — if a client needs uploads, raise it with the user; that's a platform-team feature, not a per-site hack.

---

© 2026 Pixelotech. All rights reserved. Proprietary — Pixelotech internal use only. See LICENSE.md. Contact: https://pixelotech.com
