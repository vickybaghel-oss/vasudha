"use client";

import { useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import { submitForm } from "@/lib/forms";

export function ContactClosing() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const { ok } = await submitForm({
        form: "contact",
        fields: formData,
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
            Share what you would like to know and the Saanidhya Greens team will help you take the next step.
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
          <form className="contact-form" onSubmit={handleSubmit} noValidate={false}>
            {status === "success" ? (
              <div className="rounded-2xl border border-white/20 bg-white/5 p-8 text-center">
                <h3 className="font-display text-3xl text-surface">Thank you</h3>
                <p className="mt-3 text-sm text-white/70">
                  Your enquiry has been received. Our team will get in touch with you shortly.
                </p>
                <button
                  type="button"
                  className="contact-submit mt-6"
                  onClick={() => setStatus("idle")}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <label className="contact-field">
                  <span>Your name</span>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    aria-invalid="false"
                  />
                </label>

                <label className="contact-field">
                  <span>Email address</span>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid="false"
                  />
                </label>

                <label className="contact-field">
                  <span>Phone number (optional)</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    aria-invalid="false"
                  />
                </label>

                <label className="contact-field">
                  <span>Your message</span>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    aria-invalid="false"
                  ></textarea>
                </label>

                <button
                  type="submit"
                  className="contact-submit"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? "Sending..." : "Request details"}
                </button>

                {status === "error" && (
                  <p className="mt-3 text-sm text-red-400">
                    Something went wrong. Please call us directly at {site.phones[0]} or email {site.email}.
                  </p>
                )}

                <p className="contact-privacy">
                  We use your details to respond to your enquiry. Read our{" "}
                  <Link href="/privacy/">Privacy Policy</Link>.
                </p>
                <div aria-live="polite"></div>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
