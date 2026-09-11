"use client";

import { useState } from "react";

const AMENITY_ITEMS = [
  {
    id: "clubhouse",
    index: "01",
    name: "Clubhouse",
    image: "/images/image-10.webp",
    alt: "Warm clubhouse suite with sculptural wall detail, bed and lounge seating.",
    description: "A social and recreational heart for the community.",
  },
  {
    id: "pool",
    index: "02",
    name: "Swimming Pool",
    image: "/images/image-09.webp",
    alt: "Clubhouse facade with poolside landscape and evening-lit architectural screens.",
    description: "A calm water court for leisure and movement.",
  },
  {
    id: "gym",
    index: "03",
    name: "Indoor Gymnasium",
    image: "/images/image-07.webp",
    alt: "Modern gym interior with cardio and strength equipment at Saanidhya Greens.",
    description: "A focused space for everyday training and wellbeing.",
  },
  {
    id: "outdoor-games",
    index: "04",
    name: "Outdoor Games",
    image: "/images/image-14.webp",
    alt: "Outdoor play and recreation areas at Saanidhya Greens.",
    description: "Active spaces woven into the landscape.",
  },
  {
    id: "multipurpose-hall",
    index: "05",
    name: "Multipurpose Hall",
    image: "/images/image-05.webp",
    alt: "Private theatre and gathering room with warm acoustic panels.",
    description: "A flexible room for cultural and community use.",
  },
];

export function AmenitiesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = AMENITY_ITEMS[activeIndex];

  return (
    <section id="amenities" className="page-gutter bg-night py-28 text-white md:py-40" data-theme="dark">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-12 xl:grid-cols-[0.75fr_1.25fr] xl:items-end">
          <div>
            <p className="eyebrow text-white/50">03 · Resort-style amenities</p>
            <h2 className="reveal-text editorial-heading editorial-heading-compact mt-6 font-display text-[clamp(4rem,7vw,7.6rem)] tracking-[-0.04em] text-white">
              <span>A world of delight.</span>
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-7 text-white/58">
            Move through the spaces that turn the everyday into a retreat—from the social heart of the club to water, sport and celebration.
          </p>
        </div>

        <div className="mt-20 grid gap-8 xl:grid-cols-[0.7fr_1.3fr]">
          <div className="divide-y divide-white/14 border-y border-white/14">
            {AMENITY_ITEMS.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={item.id}
                  type="button"
                  className="amenity-row"
                  data-active={isActive ? "true" : "false"}
                  aria-pressed={isActive}
                  onClick={() => setActiveIndex(idx)}
                >
                  <span>{item.index}</span>
                  <strong>{item.name}</strong>
                  <i>↗</i>
                </button>
              );
            })}
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-[1.5rem] lg:min-h-[650px]">
            <div
              className="amenity-visual absolute inset-0 transition-opacity duration-500"
              style={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={activeItem.image}
                alt={activeItem.alt}
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
                src={activeItem.image}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-transparent to-transparent"></div>
            <div className="absolute inset-x-8 bottom-8 md:inset-x-12 md:bottom-12">
              <p className="font-display text-3xl md:text-5xl">{activeItem.name}</p>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/65">{activeItem.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
