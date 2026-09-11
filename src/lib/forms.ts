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
