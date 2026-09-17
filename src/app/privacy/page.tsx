import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${site.name}. How we handle and protect information collected through our website.`,
  alternates: {
    canonical: "/privacy/",
  },
};

export default function PrivacyPage() {
  return (
    <main className="page-gutter min-h-screen bg-background pt-36 pb-24 md:pt-44 md:pb-32">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent transition-opacity hover:opacity-80"
        >
          ← Back to home
        </Link>

        <h1 className="editorial-heading mt-6 font-display text-[clamp(2.5rem,5vw,4.5rem)] text-heading">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-foreground/70">
          Effective date: September 11, 2026
        </p>

        <div className="mt-10 space-y-6 text-base leading-relaxed text-foreground/85">
          <p>
            This privacy policy describes how {site.name} (&quot;we&quot;, &quot;us&quot;) handles information
            collected through {site.domain} (the &quot;Site&quot;).
          </p>

          <h2 className="font-display text-2xl font-semibold text-heading pt-6 pb-2 border-b border-heading/15">
            Information we collect
          </h2>
          <p>
            <strong>Information you give us.</strong> When you submit an enquiry on the Site (for example, the contact form),
            we receive the details you enter—typically your name, email address, phone number, and message. Form submissions
            are transmitted and processed securely on our behalf so our team can respond to your enquiry.
          </p>
          <p>
            <strong>Hosting logs.</strong> The Site is served via static hosting (Cloudflare), which processes technical data such
            as IP addresses in server logs for security and delivery purposes.
          </p>

          <h2 className="font-display text-2xl font-semibold text-heading pt-6 pb-2 border-b border-heading/15">
            How we use information
          </h2>
          <p>
            We use the information above to respond to your plotted living enquiries, provide project updates, and keep the Site secure.
            We do <strong>not</strong> sell your personal information, and we do not use it for third-party advertising.
          </p>

          <h2 className="font-display text-2xl font-semibold text-heading pt-6 pb-2 border-b border-heading/15">
            Sharing
          </h2>
          <p>
            We do not share your personal information with third parties except as necessary to process enquiries and maintain our communications,
            or where required by law.
          </p>

          <h2 className="font-display text-2xl font-semibold text-heading pt-6 pb-2 border-b border-heading/15">
            Contact us
          </h2>
          <p>
            If you have questions about this policy or your personal details, please reach out to us:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-base text-foreground/85">
            <li>Address: {site.fullAddress}</li>
            <li>Phone: {site.phones[0]}</li>
            <li>Email: {site.email}</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
