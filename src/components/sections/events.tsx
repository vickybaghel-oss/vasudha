"use client";

import { useEffect, useRef, useState } from "react";

const EVENT_ITEMS = [
  {
    label: "Celebration",
    text: "Milestones framed by garden, light and open sky.",
    image: {
      src: "/images/event-celebration.webp",
      alt: "An elegant evening gathering beneath a sculptural canopy on the event lawn.",
      focalPoint: "58% 55%",
    },
  },
  {
    label: "Gathering",
    text: "A generous lawn shaped for shared evenings.",
    image: {
      src: "/images/event-gathering.webp",
      alt: "Golden hour front view of the Saanidhya Greens clubhouse, lawn and arrival drive.",
      focalPoint: "50% 50%",
    },
  },
  {
    label: "Community",
    text: "Music, culture and conversation at the heart of the landscape.",
    image: {
      src: "/images/event-community.webp",
      alt: "Sunset view of the clubhouse terrace, gardens and arrival road at Saanidhya Greens.",
      focalPoint: "58% 50%",
    },
  },
];

function clamp(val: number) {
  return Math.min(1, Math.max(0, val));
}

function getSectionProgress(top: number, sectionHeight: number, viewportHeight: number) {
  return clamp(-top / Math.max(sectionHeight - viewportHeight, 1));
}

export function EventsStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [entranceProgress, setEntranceProgress] = useState(1);

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      // Entrance animation as section enters viewport from bottom
      if (rect.top > 0) {
        const p = clamp((vh - rect.top) / vh);
        setEntranceProgress(p);
      } else {
        setEntranceProgress(1);
      }

      // Progression through the 3 event stages
      const progress = getSectionProgress(rect.top, section.offsetHeight, vh);
      const nextIndex = Math.min(
        EVENT_ITEMS.length - 1,
        Math.floor(progress * EVENT_ITEMS.length)
      );

      setActiveIndex((curr) => {
        if (curr !== nextIndex) {
          setPrevIndex(curr);
          return nextIndex;
        }
        return curr;
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const activeItem = EVENT_ITEMS[activeIndex];
  const prevItem = EVENT_ITEMS[prevIndex];

  return (
    <section ref={sectionRef} id="events" className="events-story bg-night text-white" data-theme="dark">
      <div className="events-stage">
        <div
          className="event-image-mask"
          style={{
            clipPath: `inset(0 0 ${(1 - entranceProgress) * 100}% 0)`,
            transform: `scale(${1 + (1 - entranceProgress) * 0.08})`,
            transition: "clip-path 0.1s linear, transform 0.1s linear",
          }}
        >
          {/* Background previous image for seamless crossfade */}
          <div className="event-background absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={prevItem.image.alt}
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
                objectPosition: prevItem.image.focalPoint,
                color: "transparent",
              }}
              src={prevItem.image.src}
            />
          </div>

          {/* Active image layer with smooth zoom & fade entrance */}
          <div
            key={activeItem.label}
            className="event-background absolute inset-0 z-[1]"
            style={{
              animation: "eventVisualIn 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards",
              willChange: "transform, opacity",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={activeItem.image.alt}
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
                objectPosition: activeItem.image.focalPoint,
                color: "transparent",
              }}
              src={activeItem.image.src}
            />
          </div>
        </div>
        <div
          className="event-wipe-scrim"
          aria-hidden="true"
          style={{
            opacity: 0.78 * (1 - entranceProgress),
            transform: `translateY(${entranceProgress * 100}%)`,
            transition: "opacity 0.1s linear, transform 0.1s linear",
          }}
        ></div>
        <div className="event-depth-gradient" aria-hidden="true"></div>
        <div className="event-glow" aria-hidden="true"></div>
        <div className="page-gutter relative z-10 flex min-h-[100svh] flex-col justify-between py-28 md:py-36">
          <div>
            <p className="eyebrow text-white/55">08 · Events arena</p>
            <h2 className="editorial-heading mt-6 font-display text-[clamp(4.5rem,9vw,9.5rem)] tracking-[-0.045em]">
              Grand moments, naturally framed.
            </h2>
          </div>
          <div>
            <ul className="event-narrative-list sr-only">
              <li>
                <strong>Celebration</strong> Milestones framed by garden, light and open sky.
              </li>
              <li>
                <strong>Gathering</strong> A generous lawn shaped for shared evenings.
              </li>
              <li>
                <strong>Community</strong> Music, culture and conversation at the heart of the landscape.
              </li>
            </ul>
            <div className="event-animated-narrative" aria-hidden="true">
              <div
                key={activeItem.label}
                className="event-narrative"
                style={{
                  animation: "eventNarrativeIn 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards",
                  willChange: "transform, opacity",
                }}
              >
                <p className="eyebrow">{activeItem.label}</p>
                <p>{activeItem.text}</p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/25 pt-7 text-xs font-semibold tracking-[0.12em] text-white/75 uppercase">
              <span>Weddings</span>
              <span>Milestones</span>
              <span>Music evenings</span>
              <span>Central party lawn</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
