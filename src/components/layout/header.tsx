"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

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

  return (
    <header
      className="site-header"
      data-dark={isDark ? "true" : "false"}
      data-compact={isCompact ? "true" : "false"}
    >
      <a href="#hero" className="site-brand" aria-label="Saanidhya Greens">
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
        <a className="site-enquire" href="#contact">
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
            href="#nature"
            className="nav-menu-link font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-none"
            onClick={closeNav}
          >
            <sup className="nav-menu-index">01</sup>
            <span className="nav-menu-label">Nature</span>
          </a>
          <a
            href="#lifestyle"
            className="nav-menu-link font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-none"
            onClick={closeNav}
          >
            <sup className="nav-menu-index">02</sup>
            <span className="nav-menu-label">Lifestyle</span>
          </a>
          <a
            href="#gallery"
            className="nav-menu-link font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-none"
            onClick={closeNav}
          >
            <sup className="nav-menu-index">03</sup>
            <span className="nav-menu-label">Gallery</span>
          </a>
          <a
            href="#location"
            className="nav-menu-link font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-none"
            onClick={closeNav}
          >
            <sup className="nav-menu-index">04</sup>
            <span className="nav-menu-label">Location</span>
          </a>
          <a
            href="#contact"
            className="nav-menu-link font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-none"
            onClick={closeNav}
          >
            <sup className="nav-menu-index">05</sup>
            <span className="nav-menu-label">Enquire</span>
          </a>
        </nav>
      </dialog>
    </header>
  );
}
