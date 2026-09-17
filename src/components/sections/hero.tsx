"use client";

import { useEffect, useRef } from "react";

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const shell = shellRef.current;
    const image = imageRef.current;
    if (!hero || !shell || !image) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 900px)");

    let ticking = false;

    function updateHero() {
      ticking = false;
      const hero = heroRef.current;
      const shell = shellRef.current;
      const image = imageRef.current;
      if (!hero || !shell || !image) return;

      if (reducedMotionQuery.matches || mobileQuery.matches) {
        shell.style.height = "";
        shell.style.top = "";
        shell.style.marginInline = "";
        shell.style.borderRadius = "";
        image.style.transform = "";
        return;
      }

      const rect = hero.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const progress = Math.min(Math.max(-rect.top / Math.max(viewport * 0.75, 1), 0), 1);

      const height = 25 + 75 * progress;
      const top = 75 - 75 * progress;
      const gutterFactor = 1 - progress;
      const radius = 1.15 * gutterFactor;
      const scale = 1.08 - 0.08 * progress;

      shell.style.height = `${height.toFixed(3)}svh`;
      shell.style.top = `${top.toFixed(3)}svh`;
      shell.style.marginInline = `calc(var(--page-gutter) * ${gutterFactor.toFixed(3)})`;
      shell.style.borderRadius = `${radius.toFixed(3)}rem ${radius.toFixed(3)}rem 0 0`;
      image.style.transform = `scale(${scale.toFixed(4)})`;
    }

    function onScrollOrResize() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateHero);
      }
    }

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    reducedMotionQuery.addEventListener?.("change", onScrollOrResize);
    mobileQuery.addEventListener?.("change", onScrollOrResize);

    updateHero();

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      reducedMotionQuery.removeEventListener?.("change", onScrollOrResize);
      mobileQuery.removeEventListener?.("change", onScrollOrResize);
    };
  }, []);

  return (
    <section id="hero" ref={heroRef} className="hero-section" data-theme="dark">
      <div className="hero-stage">
        <div className="hero-copy">
          <p className="hero-kicker">Premium residential open plots / Vadodara</p>
          <h1 aria-label="Serenity flows into luxury">
            <span className="hero-title-line hero-title-line-primary">Serenity Flows</span>
            <span className="hero-title-row">
              <span>Into</span>
              <i aria-hidden="true"></i>
              <em>Luxury</em>
            </span>
          </h1>
        </div>
        <a className="hero-plan-link" href="#contact">
          Talk your plan <span aria-hidden="true">↗</span>
        </a>
        <aside className="hero-thumbnail-card" aria-label="Saanidhya Greens introduction">
          <a href="#luxury" className="hero-thumbnail" aria-label="Explore luxury living">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Sunset aerial view of the Saanidhya Greens clubhouse and landscaped arrival."
              loading="lazy"
              decoding="async"
              style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                objectFit: "cover",
                objectPosition: "50% 50%",
                color: "transparent",
              }}
              src="/images/image-02.webp"
            />
            <span aria-hidden="true">→</span>
          </a>
          <p>
            Creating a plotted retreat with layered greens, resort amenities, and room for a life designed at your own pace.
          </p>
        </aside>
        <div className="hero-meta-row">
          <span>Est. 2026</span>
          <span>Luxury plotted residences</span>
          <span>Architectural precision</span>
        </div>
      </div>
      <div ref={shellRef} className="hero-scroll-image" data-initial-visible="25">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imageRef}
          alt="Sunset aerial view of the Saanidhya Greens clubhouse, sports courts and surrounding landscape."
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="hero-scroll-image-media"
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            objectFit: "cover",
            objectPosition: "50% 50%",
            color: "transparent",
          }}
          src="/images/image-03.webp"
        />
      </div>
    </section>
  );
}
