"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { smoothScrollToTarget } from "@/lib/smooth-scroll";

function getHeaderDarkState(
  sections: { id: string; theme?: string; top: number; bottom: number }[],
  scrollY: number,
  viewportHeight: number,
  isHome = true
) {
  const currentSection = sections.find(({ top, bottom }) => top <= 64 && bottom > 64);
  if (!currentSection) return false;
  if (currentSection.id === "hero" && isHome && scrollY < 0.55 * viewportHeight) {
    return false; // At the top of hero, header is LIGHT theme (dark text/border)
  }
  return currentSection.theme === "dark";
}

export function Header() {
  const pathname = usePathname();
  const [isCompact, setIsCompact] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    function updateHeader() {
      const scrollY = window.scrollY;
      const vh = window.innerHeight || 1;
      const isHome = !pathname || pathname === "/";

      // Compact state matches original site: past 0.55 of hero
      setIsCompact(scrollY > 0.55 * vh);

      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-theme]"),
        (el) => {
          const rect = el.getBoundingClientRect();
          return {
            id: el.id,
            theme: el.dataset.theme,
            top: rect.top,
            bottom: rect.bottom,
          };
        }
      );

      setIsDark(getHeaderDarkState(sections, scrollY, vh, isHome));
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    window.addEventListener("resize", updateHeader);
    return () => {
      window.removeEventListener("scroll", updateHeader);
      window.removeEventListener("resize", updateHeader);
    };
  }, [pathname]);

  const openNav = () => {
    setIsOpen(true);
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  };

  const closeNav = () => {
    setIsOpen(false);
    if (dialogRef.current && dialogRef.current.open) {
      dialogRef.current.close();
    }
  };

  const isHome = !pathname || pathname === "/";

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    if (isOpen) {
      closeNav();
    }
    if (!isHome) {
      // If on another page (e.g. /privacy or 404), redirect to home page with hash
      window.location.href = hash === "#hero" ? "/" : `/${hash}`;
      return;
    }
    setTimeout(() => {
      smoothScrollToTarget(hash, { duration: 850 });
      window.history.pushState(null, "", hash === "#hero" ? "/" : hash);
    }, 25);
  };

  return (
    <header
      className="site-header"
      data-dark={isDark ? "true" : "false"}
      data-compact={isCompact ? "true" : "false"}
    >
      <a
        href={isHome ? "#hero" : "/"}
        className="site-brand"
        aria-label="Saanidhya Greens"
        onClick={(e) => handleNavClick(e, "#hero")}
      >
        <Image
          src="/images/image-01.png"
          alt="Saanidhya Greens"
          width={900}
          height={290}
          priority
          className="site-brand-logo"
        />
      </a>

      <div className="flex items-center gap-3">
        <a
          className="site-enquire"
          href={isHome ? "#contact" : "/#contact"}
          onClick={(e) => handleNavClick(e, "#contact")}
        >
          Enquire
        </a>
        <button
          className="site-menu-button"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isOpen}
          aria-controls="site-navigation-dialog"
          onClick={isOpen ? closeNav : openNav}
        >
          <span aria-hidden="true">{isOpen ? "×" : "≡"}</span>
        </button>
      </div>

      <dialog
        ref={dialogRef}
        id="site-navigation-dialog"
        className="nav-panel"
        data-open={isOpen ? "true" : "false"}
        aria-label="Site navigation"
        onClick={(e) => {
          if (e.target === dialogRef.current) closeNav();
        }}
      >
        <button
          type="button"
          className="absolute right-6 top-6 grid size-11 place-items-center rounded-full border border-white/25 text-white text-xl"
          aria-label="Close navigation"
          onClick={closeNav}
        >
          ×
        </button>

        <nav className="nav-menu-list">
          <a
            href={isHome ? "#nature" : "/#nature"}
            className="nav-menu-link font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-none"
            onClick={(e) => handleNavClick(e, "#nature")}
          >
            <sup className="nav-menu-index">01</sup>
            <span className="nav-menu-label">Nature</span>
          </a>
          <a
            href={isHome ? "#lifestyle" : "/#lifestyle"}
            className="nav-menu-link font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-none"
            onClick={(e) => handleNavClick(e, "#lifestyle")}
          >
            <sup className="nav-menu-index">02</sup>
            <span className="nav-menu-label">Lifestyle</span>
          </a>
          <a
            href={isHome ? "#gallery" : "/#gallery"}
            className="nav-menu-link font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-none"
            onClick={(e) => handleNavClick(e, "#gallery")}
          >
            <sup className="nav-menu-index">03</sup>
            <span className="nav-menu-label">Gallery</span>
          </a>
          <a
            href={isHome ? "#location" : "/#location"}
            className="nav-menu-link font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-none"
            onClick={(e) => handleNavClick(e, "#location")}
          >
            <sup className="nav-menu-index">04</sup>
            <span className="nav-menu-label">Location</span>
          </a>
          <a
            href={isHome ? "#contact" : "/#contact"}
            className="nav-menu-link font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-none"
            onClick={(e) => handleNavClick(e, "#contact")}
          >
            <sup className="nav-menu-index">05</sup>
            <span className="nav-menu-label">Enquire</span>
          </a>
        </nav>
      </dialog>
    </header>
  );
}
