import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer page-gutter" data-theme="light">
      <div className="site-footer-inner">
        <div className="site-footer-brand" aria-label="Saanidhya Greens">
          <Image
            src="/images/image-01.png"
            alt="Saanidhya Greens"
            width={900}
            height={290}
            loading="lazy"
            className="site-footer-brand-logo"
          />
        </div>

        <nav className="site-footer-column" aria-label="Project links">
          <p>Project</p>
          <a href="#luxury">Premium Plots</a>
          <a href="#lifestyle">Club Lifestyle</a>
          <a href="#amenities">Amenities</a>
          <a href="#gallery">Gallery</a>
        </nav>

        <nav className="site-footer-column" aria-label="Explore links">
          <p>Explore</p>
          <a href="#nature">Nature</a>
          <a href="#gallery">Gallery</a>
          <a href="#location">Location</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="site-footer-column site-footer-connect">
          <p>Connect</p>
          <a href={`tel:${site.phones[0].replace(/\s+/g, "")}`}>{site.phones[0]}</a>
          <a href={`tel:${site.phones[1].replace(/\s+/g, "")}`}>{site.phones[1]}</a>
          <span>{site.fullAddress}</span>
        </div>

        <div className="site-footer-action">
          <p>Begin your enquiry</p>
          <form className="site-footer-enquiry" action="#contact">
            <label className="sr-only" htmlFor="footer-email">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              name="email"
            />
            <button type="submit" aria-label="Go to enquiry form">
              →
            </button>
          </form>
        </div>
      </div>

      <div className="site-footer-bottom">
        <p>Premium residential open plots / Vadodara</p>
        <div>
          <Link href="/privacy/">Privacy</Link>
          <a href="#contact">Enquire</a>
          <span>© 2026 Saanidhya Greens</span>
        </div>
      </div>
    </footer>
  );
}
