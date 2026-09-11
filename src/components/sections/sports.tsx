"use client";

import { useEffect, useRef, useState } from "react";

const SPORTS_LIST = [
  {
    id: "pickleball",
    index: "01",
    title: "Pickleball",
    desc: "A social court shaped for easy competition.",
    image: "/images/image-13.webp",
    position: "50% 54%",
  },
  {
    id: "box-cricket",
    index: "02",
    title: "Box Cricket",
    desc: "Fast innings within a dedicated practice arena.",
    image: "/images/image-14.webp",
    position: "50% 52%",
  },
  {
    id: "basketball",
    index: "03",
    title: "Basketball",
    desc: "An open court beneath the evening sky.",
    image: "/images/image-15.webp",
    position: "52% 56%",
  },
  {
    id: "badminton",
    index: "04",
    title: "Badminton",
    desc: "Indoor play for every season.",
    image: "/images/image-16.webp",
    position: "50% 56%",
  },
];

function clamp(val: number) {
  return Math.min(1, Math.max(0, val));
}

function getSectionProgress(top: number, sectionHeight: number, viewportHeight: number) {
  return clamp(-top / Math.max(sectionHeight - viewportHeight, 1));
}

function getHorizontalOffset(progress: number, scrollWidth: number, innerWidth: number, padding = 120) {
  const offset = -Math.max(0, scrollWidth - innerWidth + padding) * clamp(progress);
  return offset === 0 ? 0 : offset;
}

function getCarouselTargetY(
  targetIndex: number,
  totalItems: number,
  sectionTopInPage: number,
  sectionHeight: number,
  viewportHeight: number
) {
  if (totalItems <= 1) return sectionTopInPage;
  return sectionTopInPage + Math.max(0, sectionHeight - viewportHeight) * clamp(targetIndex / (totalItems - 1));
}

function getNearestCarouselIndex(centers: number[], targetCenter: number) {
  return centers.reduce(
    (closest, curr, i) =>
      Math.abs(curr - targetCenter) < Math.abs((centers[closest] ?? targetCenter) - targetCenter) ? i : closest,
    0
  );
}

function getCarouselMode() {
  const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  return {
    nativeCarousel: isMobile || reducedMotion,
    reducedMotion,
  };
}

export function SportsStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const dragRef = useRef<{ pointerId: number; x: number; scrollY: number } | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToSport = (idx: number) => {
    const targetIndex = (idx + SPORTS_LIST.length) % SPORTS_LIST.length;
    setActiveIndex(targetIndex);
    const card = cardRefs.current[targetIndex];
    card?.focus({ preventScroll: true });

    const { nativeCarousel, reducedMotion } = getCarouselMode();
    if (nativeCarousel) {
      card?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "nearest",
        inline: "center",
      });
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    const sectionTopInPage = section.getBoundingClientRect().top + window.scrollY;
    const targetY = getCarouselTargetY(
      targetIndex,
      SPORTS_LIST.length,
      sectionTopInPage,
      section.offsetHeight,
      window.innerHeight
    );
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      const { nativeCarousel } = getCarouselMode();

      if (!section || !track || nativeCarousel) {
        if (track) track.style.transform = "none";
        return;
      }

      const rect = section.getBoundingClientRect();
      const progress = getSectionProgress(rect.top, section.offsetHeight, window.innerHeight);
      const offset = getHorizontalOffset(progress, track.scrollWidth, window.innerWidth);
      track.style.transform = `translate3d(${offset}px, 0, 0)`;

      const active = Math.min(SPORTS_LIST.length - 1, Math.round(progress * (SPORTS_LIST.length - 1)));
      setActiveIndex(active);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} id="sports" className="sports-story bg-background" data-theme="light">
      <div className="sports-sticky">
        <div className="page-gutter mb-10 flex items-end justify-between">
          <div>
            <p className="eyebrow text-accent">07 · Sports arena</p>
            <h2 className="editorial-heading editorial-heading-compact mt-4 font-display text-[clamp(4rem,7vw,7.5rem)] text-heading">
              Play without limits.
            </h2>
          </div>
          <p className="hidden max-w-xs text-sm leading-6 lg:block">
            Indoor or outdoor, the club landscape keeps movement close at hand.
          </p>
        </div>

        <div
          ref={trackRef}
          className="sports-track cursor-grab active:cursor-grabbing select-none"
          role="region"
          aria-label="Sports arena gallery"
          tabIndex={0}
          onPointerDown={(e) => {
            const { nativeCarousel } = getCarouselMode();
            if (
              !nativeCarousel &&
              e.pointerType !== "touch" &&
              window.matchMedia("(pointer: fine)").matches &&
              e.isPrimary &&
              e.button === 0
            ) {
              e.currentTarget.setPointerCapture(e.pointerId);
              dragRef.current = { pointerId: e.pointerId, x: e.clientX, scrollY: window.scrollY };
            }
          }}
          onPointerMove={(e) => {
            if (dragRef.current && dragRef.current.pointerId === e.pointerId) {
              window.scrollTo({
                top: dragRef.current.scrollY + (dragRef.current.x - e.clientX) * 2.2,
                behavior: "auto",
              });
            }
          }}
          onPointerUp={(e) => {
            if (dragRef.current && dragRef.current.pointerId === e.pointerId) {
              dragRef.current = null;
            }
          }}
          onPointerCancel={(e) => {
            if (dragRef.current && dragRef.current.pointerId === e.pointerId) {
              dragRef.current = null;
            }
          }}
          onLostPointerCapture={(e) => {
            if (dragRef.current && dragRef.current.pointerId === e.pointerId) {
              dragRef.current = null;
            }
          }}
          onScroll={(e) => {
            const { nativeCarousel } = getCarouselMode();
            if (!nativeCarousel) return;
            const trackRect = e.currentTarget.getBoundingClientRect();
            const trackCenter = trackRect.left + trackRect.width / 2;
            const centers = cardRefs.current.map((card) => {
              const cardRect = card?.getBoundingClientRect();
              return cardRect ? cardRect.left + cardRect.width / 2 : trackCenter;
            });
            setActiveIndex(getNearestCarouselIndex(centers, trackCenter));
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              scrollToSport(activeIndex + 1);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              scrollToSport(activeIndex - 1);
            }
          }}
        >
          {SPORTS_LIST.map((sport, idx) => {
            const isActive = activeIndex === idx;
            return (
              <article
                key={sport.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className="sports-card"
                data-active={isActive ? "true" : "false"}
                tabIndex={-1}
                aria-label={`${sport.title}: ${sport.desc}`}
                onClick={() => scrollToSport(idx)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
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
                    objectPosition: sport.position,
                    color: "transparent",
                  }}
                  src={sport.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-transparent to-transparent"></div>
                <div className="absolute inset-x-7 bottom-7 text-white md:inset-x-10 md:bottom-10">
                  <p className="eyebrow text-white/55">{sport.index}</p>
                  <h3 className="mt-2 font-display text-4xl md:text-6xl">{sport.title}</h3>
                  <p className="mt-2 max-w-sm text-sm text-white/65">{sport.desc}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="sports-controls">
          <button type="button" aria-label="Previous sport" onClick={() => scrollToSport(activeIndex - 1)}>
            ←
          </button>
          <span aria-live="polite">
            {String(activeIndex + 1).padStart(2, "0")} / {String(SPORTS_LIST.length).padStart(2, "0")}
          </span>
          <button type="button" aria-label="Next sport" onClick={() => scrollToSport(activeIndex + 1)}>
            →
          </button>
        </div>
      </div>
    </section>
  );
}
