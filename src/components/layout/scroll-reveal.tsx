"use client";

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const titles = Array.from(
      document.querySelectorAll<HTMLElement>("main section h1, main section h2")
    );
    titles.forEach((title) => {
      title.classList.add("section-title-3d");
    });

    const revealItems = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".reveal-text, .philosophy-card, .section-title-3d"
      )
    );

    const reveal = (item: HTMLElement) => {
      item.dataset.visible = "true";
      item.dataset.titleVisible = "true";
    };

    if (!("IntersectionObserver" in window) || reducedMotion) {
      revealItems.forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );

    revealItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.90 && rect.bottom > 0) {
        reveal(item);
      } else {
        observer.observe(item);
      }
    });

    const onScroll = () => {
      const vh = window.innerHeight || 1;
      revealItems.forEach((item) => {
        if (item.dataset.titleVisible !== "true" || item.dataset.visible !== "true") {
          const rect = item.getBoundingClientRect();
          if (rect.top < vh * 0.90 && rect.bottom > 0) {
            reveal(item);
            observer.unobserve(item);
          }
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      titles.forEach((title) => {
        title.classList.remove("section-title-3d");
        delete title.dataset.titleVisible;
      });
    };
  }, []);

  return null;
}
