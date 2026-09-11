"use client";

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealItems.forEach((item) => {
      if (item.getBoundingClientRect().top < window.innerHeight * 0.92) {
        reveal(item);
      } else {
        observer.observe(item);
      }
    });

    const onScroll = () => {
      const vh = window.innerHeight || 1;
      revealItems.forEach((item) => {
        if (item.dataset.visible !== "true") {
          const rect = item.getBoundingClientRect();
          if (rect.top < vh * 0.92 && rect.bottom > 0) {
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
    };
  }, []);

  return null;
}
