"use client";

import { useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import { submitForm } from "@/lib/forms";
import {
  normalizeContactFields,
  type ContactFieldErrors,
  type ContactFields,
  validateContactFields,
} from "@/lib/form-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactClosing() {
  const [formData, setFormData] = useState<ContactFields>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = e.target.name as keyof ContactFields;
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (status === "error") setStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validateContactFields(formData);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstInvalidField = Object.keys(nextErrors)[0];
      const field = e.currentTarget.elements.namedItem(firstInvalidField);
      if (field instanceof HTMLElement) field.focus();
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const { ok } = await submitForm({
        form: "contact",
        fields: normalizeContactFields(formData),
      });

      if (ok) {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="contact-closing page-gutter bg-night py-28 text-white md:py-40" data-theme="dark">
      <div className="mx-auto grid max-w-[1500px] gap-16 xl:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow text-surface/80">14 · Begin your journey</p>
          <h2 className="editorial-heading mt-6 font-display text-[clamp(4.5rem,8vw,8.5rem)] tracking-[-0.045em] text-surface">
            Find your place in nature.
          </h2>
          <p className="mt-10 max-w-sm text-sm leading-7">
            Share what you would like to know and the {site.name} team will help you take the next step.
          </p>
          <div className="mt-10 flex flex-col gap-2 text-sm">
            {site.phones.map((phone) => (
              <a key={phone} href={`tel:${phone.replace(/\s+/g, "")}`} className="contact-phone">
                {phone}
              </a>
            ))}
          </div>
        </div>

        <div className="xl:pt-20">
          <form className="contact-form" onSubmit={handleSubmit} noValidate aria-busy={status === "submitting"}>
            {status === "success" ? (
              <div
                className="rounded-2xl border border-white/20 bg-white/5 p-8 text-center"
                role="status"
                aria-live="polite"
              >
                <h3 className="font-display text-3xl text-surface">Thank you</h3>
                <p className="mt-3 text-sm text-white/70">
                  Your enquiry has been received. Our team will get in touch with you shortly.
                </p>
                <Button
                  type="button"
                  className="contact-submit mt-6"
                  onClick={() => setStatus("idle")}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <>
                <Label className="contact-field" htmlFor="contact-name">
                  <span>Your name</span>
                  <Input
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                  />
                  {errors.name && (
                    <span id="contact-name-error" className="text-xs text-red-300" role="alert">
                      {errors.name}
                    </span>
                  )}
                </Label>

                <Label className="contact-field" htmlFor="contact-email">
                  <span>Email address</span>
                  <Input
                    id="contact-email"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                  />
                  {errors.email && (
                    <span id="contact-email-error" className="text-xs text-red-300" role="alert">
                      {errors.email}
                    </span>
                  )}
                </Label>

                <Label className="contact-field" htmlFor="contact-phone">
                  <span>Phone number (optional)</span>
                  <Input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Label>

                <Label className="contact-field" htmlFor="contact-message">
                  <span>Your message</span>
                  <Textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                  />
                </Label>

                <Button
                  type="submit"
                  className="contact-submit"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? "Sending..." : "Request details"}
                </Button>

                {status === "error" && (
                  <p className="mt-3 text-sm text-red-400" role="alert" aria-live="assertive">
                    Something went wrong. Please call us directly at {site.phones[0]} or email {site.email}.
                  </p>
                )}

                <p className="contact-privacy">
                  We use your details to respond to your enquiry. Read our{" "}
                  <Link href="/privacy/">Privacy Policy</Link>.
                </p>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
