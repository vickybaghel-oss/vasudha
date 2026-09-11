"use client";

import { useEffect, useRef, useState } from "react";

const MODERN_AMENITIES_LIST = [
  { id: "pool", icon: "≈", name: "Swimming Pool", desc: "A calm water court for leisure and movement." },
  { id: "childrens-pool", icon: "◡", name: "Children’s Pool", desc: "A shallower pool designed for younger residents." },
  { id: "clubhouse", icon: "⌂", name: "Clubhouse", desc: "A social and recreational heart for the community." },
  { id: "gym", icon: "＋", name: "Indoor Gymnasium", desc: "A focused space for everyday training and wellbeing." },
  { id: "banquet", icon: "◇", name: "Banquet Hall", desc: "A considered setting for gatherings and celebrations." },
  { id: "multipurpose", icon: "□", name: "Multipurpose Hall", desc: "A flexible room for cultural and community use." },
  { id: "theatre", icon: "◐", name: "Open Theatre", desc: "An open-air stage for shared evenings." },
  { id: "indoor-games", icon: "◈", name: "Indoor Games", desc: "Recreation for every season and generation." },
  { id: "outdoor-games", icon: "△", name: "Outdoor Games", desc: "Active spaces woven into the landscape." },
  { id: "pickleball", icon: "◌", name: "Pickleball", desc: "Purpose-planned courts for social sport." },
  { id: "badminton", icon: "⌁", name: "Badminton", desc: "A dedicated court for fast-paced play." },
  { id: "basketball", icon: "◉", name: "Basketball Court", desc: "A full recreation court beside the clubhouse." },
  { id: "box-cricket", icon: "∥", name: "Box Cricket", desc: "Compact cricket practice within the sports terrace." },
  { id: "yoga", icon: "⌒", name: "Yoga & Meditation", desc: "A quiet landscape room for reflection." },
  { id: "jogging", icon: "↝", name: "Jogging Track", desc: "A green loop connecting movement and landscape." },
  { id: "children", icon: "✦", name: "Children’s Play Area", desc: "A safe outdoor world for creative play." },
  { id: "senior", icon: "⌑", name: "Senior Citizen Seating", desc: "Shaded places for rest and conversation." },
  { id: "garden", icon: "❧", name: "Landscaped Garden", desc: "Layered planting and generous open greens." },
  { id: "gazebo", icon: "⌢", name: "Gazebo Seating", desc: "Intimate garden shelters for unhurried moments." },
  { id: "library", icon: "Ⅱ", name: "Library", desc: "A quiet interior for reading and retreat." },
  { id: "security", icon: "⊙", name: "24×7 Security", desc: "A monitored entrance and community perimeter." },
  { id: "roads", icon: "═", name: "Internal RCC Roads", desc: "Well-planned access across the development." },
  { id: "rainwater", icon: "⌄", name: "Rainwater Harvesting", desc: "Water-conscious infrastructure integrated throughout." },
  { id: "lawn", icon: "○", name: "Central Party Lawn", desc: "A generous green venue for landmark occasions." },
];

export function ModernAmenities() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isGridVisible, setIsGridVisible] = useState(false);
  const [isHeadingVisible, setIsHeadingVisible] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      setIsGridVisible(true);
      setIsHeadingVisible(true);
      return;
    }

    const headingEl = headingRef.current;
    let headingObserver: IntersectionObserver | null = null;
    if (headingEl) {
      headingObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsHeadingVisible(true);
            headingObserver?.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      headingObserver.observe(headingEl);
    }

    const gridEl = gridRef.current;
    let gridObserver: IntersectionObserver | null = null;
    if (gridEl) {
      gridObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsGridVisible(true);
            gridObserver?.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      gridObserver.observe(gridEl);
    }

    const checkScroll = () => {
      const vh = window.innerHeight || 1;
      if (gridEl) {
        const rect = gridEl.getBoundingClientRect();
        if (rect.top < vh * 0.88 && rect.bottom > 0) {
          setIsGridVisible(true);
        }
      }
      if (headingEl) {
        const rect = headingEl.getBoundingClientRect();
        if (rect.top < vh * 0.92 && rect.bottom > 0) {
          setIsHeadingVisible(true);
        }
      }
    };

    checkScroll();
    window.addEventListener("scroll", checkScroll, { passive: true });

    return () => {
      headingObserver?.disconnect();
      gridObserver?.disconnect();
      window.removeEventListener("scroll", checkScroll);
    };
  }, []);

  return (
    <section id="modern-amenities" className="page-gutter bg-[#AF7259] py-28 text-white md:py-40" data-theme="dark">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-10 xl:grid-cols-[1fr_0.7fr] xl:items-end">
          <div>
            <p className="eyebrow text-white/55">05 · Modern amenities</p>
            <h2
              ref={headingRef}
              className="reveal-text editorial-heading editorial-heading-compact mt-6 font-display text-[clamp(4rem,7vw,7.8rem)] tracking-[-0.04em] text-white"
              data-visible={isHeadingVisible ? "true" : "false"}
            >
              <span>Freedom to indulge.</span>
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-7 text-white/68">
            More than fifty considered features shape the wider development—places for fitness, culture, family, quiet and community.
          </p>
        </div>

        <div
          ref={gridRef}
          className="amenity-grid mt-20 grid grid-cols-2 border-l border-t border-white/22 md:grid-cols-4 lg:grid-cols-6"
          data-visible={isGridVisible ? "true" : "false"}
        >
          {MODERN_AMENITIES_LIST.map((item, idx) => {
            const isExpanded = expandedId === item.id;
            const delay = (idx % 6) * 45;
            return (
              <article
                key={item.id}
                className="amenity-tile"
                data-expanded={isExpanded ? "true" : "false"}
                style={{ transitionDelay: `${delay}ms` }}
              >
                <button
                  type="button"
                  className="amenity-disclosure"
                  aria-expanded={isExpanded}
                  aria-controls={`amenity-${item.id}-description`}
                  onClick={() => toggle(item.id)}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  <span className="amenity-copy">
                    <span className="amenity-name">{item.name}</span>
                    <span id={`amenity-${item.id}-description`} className="amenity-description">
                      {item.desc}
                    </span>
                  </span>
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
