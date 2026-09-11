"use client";

import { useEffect, useRef } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function progressFor(element: HTMLElement, startOffset: number, endOffset: number) {
  const rect = element.getBoundingClientRect();
  const viewport = window.innerHeight || 1;
  const start = viewport * startOffset;
  const end = viewport * endOffset;
  return clamp((start - rect.top) / Math.max(start - end, 1), 0, 1);
}

export function NatureStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLElement>(null);
  const centerRef = useRef<HTMLElement>(null);
  const rightRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let ticking = false;

    function updateNature() {
      ticking = false;
      const section = sectionRef.current;
      const panel = panelRef.current;
      const left = leftRef.current;
      const center = centerRef.current;
      const right = rightRef.current;
      if (!section) return;

      if (reducedQuery.matches) {
        if (panel) {
          panel.style.transform = "";
          panel.style.opacity = "";
        }
        if (left) left.style.transform = "";
        if (center) center.style.transform = "";
        if (right) right.style.transform = "";
        return;
      }

      const progress = progressFor(section, 0.9, -0.08);

      if (panel) {
        const rise = lerp(4, -4, progress);
        panel.style.transform = `translate3d(0, ${rise.toFixed(3)}%, 0)`;
        panel.style.opacity = String(lerp(0.92, 1, clamp(progress / 0.25, 0, 1)));
      }
      if (left) {
        left.style.transform = `translateX(${lerp(-130, -112, progress).toFixed(3)}%) translateY(${lerp(10, -12, progress).toFixed(3)}%) rotate(${lerp(-11, -5, progress).toFixed(3)}deg)`;
      }
      if (center) {
        center.style.transform = `translateX(-50%) translateY(${lerp(4, -6, progress).toFixed(3)}%) rotate(${lerp(-1.5, 1.5, progress).toFixed(3)}deg) scale(${lerp(0.96, 1.04, progress).toFixed(3)})`;
      }
      if (right) {
        right.style.transform = `translateX(${lerp(28, 12, progress).toFixed(3)}%) translateY(${lerp(9, -10, progress).toFixed(3)}%) rotate(${lerp(11, 5, progress).toFixed(3)}deg)`;
      }
    }

    function onScrollOrResize() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateNature);
      }
    }

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    reducedQuery.addEventListener?.("change", onScrollOrResize);

    updateNature();

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      reducedQuery.removeEventListener?.("change", onScrollOrResize);
    };
  }, []);

  return (
    <section id="nature" ref={sectionRef} className="nature-story" data-theme="light" data-editorial-scene="true">
      <div className="nature-stage">
        <div ref={panelRef} className="nature-sentences nature-panel">
          <p className="nature-eyebrow">Retreat to nature</p>
          <h2 className="nature-sentence">Nature is not the weekend here.</h2>
          <div className="nature-card-strip" aria-label="Saanidhya Greens landscape moments">
            <figure ref={leftRef} className="nature-card nature-card-left">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Private theatre seating with warm acoustic wall panels at Saanidhya Greens."
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
                src="/images/image-05.webp"
              />
            </figure>
            <figure ref={centerRef} className="nature-card nature-card-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Green arrival arch and landscaped driveway at Saanidhya Greens during sunset."
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
                src="/images/image-06.webp"
              />
            </figure>
            <figure ref={rightRef} className="nature-card nature-card-right">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Modern gym interior with cardio and strength equipment at Saanidhya Greens."
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
                src="/images/image-07.webp"
              />
            </figure>
          </div>
          <p className="nature-copy">
            Urban access stays close, while the everyday rhythm slows into gardens, open skies and an unhurried plotted lifestyle.
          </p>
        </div>
      </div>
    </section>
  );
}
