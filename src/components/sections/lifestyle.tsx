"use client";

import { useEffect, useRef, useState } from "react";

const CLUB_CHAPTERS = [
  {
    id: "club-arrival",
    index: "01",
    title: "Arrival",
    description: "A planted threshold sets the pace for a slower, more considered way of living.",
    image: "/images/club-arrival.webp",
    alt: "Daytime clubhouse arrival with pool terrace, landscaped lawns and road frontage.",
  },
  {
    id: "club-lounge",
    index: "02",
    title: "Lounge",
    description: "Layered rooms invite conversation, reading and easy afternoons together.",
    image: "/images/club-lounge.webp",
    alt: "Clubhouse lounge and dining room with warm lighting, bar counter and relaxed seating.",
  },
  {
    id: "club-fitness",
    index: "03",
    title: "Wellbeing",
    description: "Fitness, yoga, pool and spa experiences form a daily ritual of renewal.",
    image: "/images/club-wellbeing.webp",
    alt: "Modern gym interior with cardio and strength equipment at Saanidhya Greens.",
  },
  {
    id: "club-recreation",
    index: "04",
    title: "Recreation",
    description: "Indoor games and outdoor courts bring every generation into play.",
    image: "/images/club-recreation.webp",
    alt: "Private theatre seating with warm acoustic wall panels at Saanidhya Greens.",
  },
  {
    id: "club-suites",
    index: "05",
    title: "Suites",
    description: "Quiet guest suites extend the comfort of the club to visiting family and friends.",
    image: "/images/club-suites.webp",
    alt: "Warm private suite with layered wood ceiling, lounge seating and garden-facing window.",
  },
];

export function ClubLifestyle() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const editorialQuery = window.matchMedia("(min-width: 1024px)");
    const chapters = Array.from(section.querySelectorAll<HTMLElement>(".club-chapter"));
    if (!chapters.length) return;

    let ticking = false;

    const updateActiveChapter = () => {
      ticking = false;
      if (reducedMotion.matches || !editorialQuery.matches) {
        setActiveIndex(0);
        return;
      }

      const focus = 0.52 * window.innerHeight;
      const closestIndex = chapters.reduce((closest, chapter, index) => {
        const currentDist = Math.abs(chapter.getBoundingClientRect().top - focus);
        const closestDist = Math.abs(chapters[closest].getBoundingClientRect().top - focus);
        return currentDist < closestDist ? index : closest;
      }, 0);

      setActiveIndex((curr) => {
        if (curr !== closestIndex) {
          setPrevIndex(curr);
          return closestIndex;
        }
        return curr;
      });
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateActiveChapter);
      }
    };

    updateActiveChapter();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  const activeChapter = CLUB_CHAPTERS[activeIndex];
  const prevChapter = CLUB_CHAPTERS[prevIndex];

  return (
    <section ref={sectionRef} id="lifestyle" className="club-story bg-background" data-theme="light">
      <div className="club-stage">
        {/* Background layer: previous chapter image to prevent gaps */}
        <div className="club-visual absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={prevChapter.alt}
            loading="lazy"
            decoding="async"
            className="object-cover"
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              objectPosition: "50% 50%",
              color: "transparent",
            }}
            src={prevChapter.image}
          />
        </div>

        {/* Foreground layer: active chapter image with smooth zoom & fade entrance */}
        <div
          key={activeChapter.id}
          className="club-visual absolute inset-0 z-[2]"
          style={{
            animation: "clubVisualIn 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards",
            willChange: "transform, opacity",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={activeChapter.alt}
            loading="lazy"
            decoding="async"
            className="object-cover"
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              objectPosition: "50% 50%",
              color: "transparent",
            }}
            src={activeChapter.image}
          />
        </div>

        <div
          className="club-entrance-glass z-[3]"
          data-active={activeIndex === 0 ? "true" : "false"}
          aria-hidden="true"
          style={{
            opacity: activeIndex === 0 ? 1 : 0,
            transition: "opacity 0.95s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        ></div>

        <p className="club-counter z-[4]" aria-hidden="true">
          {String(activeIndex + 1).padStart(2, "0")} / 05
        </p>

        <div className="page-gutter absolute inset-x-0 top-24 z-10 pointer-events-none">
          <p className="eyebrow text-white/55">04 · Club lifestyle</p>
          <h2 className="reveal-text editorial-heading editorial-heading-compact club-heading mt-5 font-display text-[clamp(4rem,7vw,7.5rem)] tracking-[-0.04em] text-white">
            <span>A culture&nbsp;of belonging.</span>
          </h2>
        </div>
      </div>

      <div className="club-chapters">
        {CLUB_CHAPTERS.map((chapter, idx) => (
          <article
            key={chapter.id}
            className="club-chapter"
            data-active={activeIndex === idx ? "true" : "false"}
          >
            <span>{chapter.index}</span>
            <h3>{chapter.title}</h3>
            <p>{chapter.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
