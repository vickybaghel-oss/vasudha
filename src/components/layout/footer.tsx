"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { submitForm } from "@/lib/forms";
import { smoothScrollToTarget } from "@/lib/smooth-scroll";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Footer() {
  const pathname = usePathname();
  const isHome = !pathname || pathname === "/";
  const [footerEmail, setFooterEmail] = useState("");
  const [footerStatus, setFooterStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleFooterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!footerEmail.trim()) return;
    setFooterStatus("submitting");

    try {
      const { ok } = await submitForm({
        form: "enquiry",
        fields: { email: footerEmail.trim() },
      });
      if (ok) {
        setFooterStatus("success");
        setFooterEmail("");
      } else {
        setFooterStatus("error");
      }
    } catch {
      setFooterStatus("error");
    }
  };

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (isHome) {
      e.preventDefault();
      smoothScrollToTarget(hash, { duration: 850 });
      window.history.pushState(null, "", hash === "#hero" ? "/" : hash);
    }
  };

  return (
    <footer className="site-footer page-gutter" data-theme="light">
      <div className="site-footer-inner">
        <div className="site-footer-brand-column">
          <Link
            href="/"
            className="site-footer-brand"
            aria-label={site.name}
            onClick={(e) => handleSectionClick(e, "#hero")}
          >
            <Image
              src="/images/image-01.png"
              alt={site.name}
              width={900}
              height={290}
              loading="lazy"
              className="site-footer-brand-logo"
            />
          </Link>

          <div className="site-footer-brand-divider" aria-hidden="true" />

          <div className="site-footer-developer-row">
            <span className="site-footer-developer-label">{site.developer.label}</span>
            <Link
              href="/"
              className="site-footer-developer-logo-link"
              aria-label={`${site.developer.name} — ${site.developer.tagline}`}
              onClick={(e) => handleSectionClick(e, "#hero")}
            >
              <Image
                src={site.developer.logo}
                alt={`${site.developer.name} — ${site.developer.tagline}`}
                width={120}
                height={150}
                loading="lazy"
                className="site-footer-developer-logo"
              />
            </Link>
          </div>
        </div>

        <nav className="site-footer-column" aria-label="Project links">
          <p>Project</p>
          {site.footerNav.project.map((item) => (
            <a
              key={item.href}
              href={isHome ? item.href : `/${item.href}`}
              onClick={(e) => handleSectionClick(e, item.href)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <nav className="site-footer-column" aria-label="Explore links">
          <p>Explore</p>
          {site.footerNav.explore.map((item) => (
            <a
              key={item.href}
              href={isHome ? item.href : `/${item.href}`}
              onClick={(e) => handleSectionClick(e, item.href)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="site-footer-column site-footer-connect">
          <p>Connect</p>
          <a href={`tel:${site.phones[0].replace(/\s+/g, "")}`}>{site.phones[0]}</a>
          <a href={`tel:${site.phones[1].replace(/\s+/g, "")}`}>{site.phones[1]}</a>
          <span>{site.fullAddress}</span>
        </div>

        <div className="site-footer-action">
          <p>Begin your enquiry</p>
          {footerStatus === "success" ? (
            <p className="mt-2 text-xs text-heading font-medium" role="status" aria-live="polite">
              Thank you! Your enquiry has been received.
            </p>
          ) : (
            <form
              className="site-footer-enquiry"
              onSubmit={handleFooterSubmit}
              aria-busy={footerStatus === "submitting"}
            >
              <Label className="sr-only" htmlFor="footer-email">
                Email address
              </Label>
              <Input
                id="footer-email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                required
                value={footerEmail}
                onChange={(e) => setFooterEmail(e.target.value)}
                disabled={footerStatus === "submitting"}
              />
              <Button
                type="submit"
                aria-label={footerStatus === "submitting" ? "Submitting enquiry" : "Submit enquiry"}
                disabled={footerStatus === "submitting"}
              >
                {footerStatus === "submitting" ? "…" : "→"}
              </Button>
            </form>
          )}
          {footerStatus === "error" && (
            <p className="mt-2 text-xs text-red-700" role="alert" aria-live="assertive">
              Something went wrong. Please call us at {site.phones[0]}.
            </p>
          )}
        </div>
      </div>

      <div className="site-footer-bottom">
        <p>{site.footerKicker}</p>
        <div>
          <Link href="/privacy/">Privacy</Link>
          <a
            href={isHome ? "#contact" : "/#contact"}
            onClick={(e) => handleSectionClick(e, "#contact")}
          >
            Enquire
          </a>
          <span>© 2026 {site.name}</span>
        </div>
      </div>
    </footer>
  );
}
