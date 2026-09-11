"use client";

import { useState } from "react";

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

export function SportsStory() {
  const [activeIndex, setActiveIndex] = useState(0);

  const prevSport = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : SPORTS_LIST.length - 1));
  };

  const nextSport = () => {
    setActiveIndex((prev) => (prev < SPORTS_LIST.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="sports" className="sports-story bg-background" data-theme="light">
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

        <div className="sports-track" role="region" aria-label="Sports arena gallery" tabIndex={0}>
          {SPORTS_LIST.map((sport, idx) => {
            const isActive = activeIndex === idx;
            return (
              <article
                key={sport.id}
                className="sports-card"
                data-active={isActive ? "true" : "false"}
                tabIndex={-1}
                aria-label={`${sport.title}: ${sport.desc}`}
                onClick={() => setActiveIndex(idx)}
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
          <button type="button" aria-label="Previous sport" onClick={prevSport}>
            ←
          </button>
          <span aria-live="polite">
            {String(activeIndex + 1).padStart(2, "0")} / 04
          </span>
          <button type="button" aria-label="Next sport" onClick={nextSport}>
            →
          </button>
        </div>
      </div>
    </section>
  );
}
