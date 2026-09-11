"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

const LOCATION_PINS = [
  {
    id: 1,
    name: "Vadodara–Dabhoi Main Road",
    left: "68%",
    top: "76%",
    cx: 68,
    cy: 76,
    route: "M74 57 C72 62 70 68 68 76",
    tag: "Primary approach",
    detail: "The main road connection shown on the brochure map.",
  },
  {
    id: 2,
    name: "Hansapura",
    left: "82%",
    top: "65%",
    cx: 82,
    cy: 65,
    route: "M74 57 C77 58 80 61 82 65",
    tag: "Immediate neighbourhood",
    detail: "The immediate rural settlement across the main road.",
  },
  {
    id: 3,
    name: "Fartikui",
    left: "82%",
    top: "81%",
    cx: 82,
    cy: 81,
    route: "M74 57 C76 64 79 73 82 81",
    tag: "Key junction",
    detail: "The well-known landmark junction directly opposite the entrance.",
  },
  {
    id: 4,
    name: "Dabhoi",
    left: "97%",
    top: "74%",
    cx: 97,
    cy: 74,
    route: "M74 57 C80 61 86 70 97 74",
    tag: "Heritage town",
    detail: "Historic township with civic amenities a short drive away.",
  },
];

function clampPan(val: number) {
  return Math.min(82, Math.max(-82, val));
}

export function LocationSection() {
  const [activePinId, setActivePinId] = useState(1);
  const [isHeadingVisible, setIsHeadingVisible] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; x: number; y: number; panX: number; panY: number } | null>(null);

  const activePin = LOCATION_PINS.find((p) => p.id === activePinId) || LOCATION_PINS[0];

  useEffect(() => {
    const headingEl = headingRef.current;
    const mapEl = mapRef.current;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      setIsHeadingVisible(true);
      setIsMapVisible(true);
      return;
    }

    const headingObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeadingVisible(true);
          headingObserver.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    const mapObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsMapVisible(true);
          mapObserver.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    if (headingEl) headingObserver.observe(headingEl);
    if (mapEl) mapObserver.observe(mapEl);

    const onScroll = () => {
      const vh = window.innerHeight || 1;
      if (!isHeadingVisible && headingEl) {
        const rect = headingEl.getBoundingClientRect();
        if (rect.top < vh * 0.90 && rect.bottom > 0) {
          setIsHeadingVisible(true);
          headingObserver.disconnect();
        }
      }
      if (!isMapVisible && mapEl) {
        const rect = mapEl.getBoundingClientRect();
        if (rect.top < vh * 0.85 && rect.bottom > 0) {
          setIsMapVisible(true);
          mapObserver.disconnect();
        }
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      headingObserver.disconnect();
      mapObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [isHeadingVisible, isMapVisible]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.isPrimary || e.button !== 0 || dragRef.current) return;
    if ((e.target as HTMLElement).closest("button, .location-project-card")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current && dragRef.current.pointerId === e.pointerId) {
      setPan({
        x: clampPan(dragRef.current.panX + e.clientX - dragRef.current.x),
        y: clampPan(dragRef.current.panY + e.clientY - dragRef.current.y),
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current && dragRef.current.pointerId === e.pointerId) {
      dragRef.current = null;
      setIsDragging(false);
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current && dragRef.current.pointerId === e.pointerId) {
      dragRef.current = null;
      setIsDragging(false);
    }
  };

  return (
    <section id="location" className="page-gutter bg-background py-28 md:py-40" data-theme="light">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(24rem,0.72fr)] xl:items-end">
          <div>
            <p className="eyebrow text-accent">12 - Location</p>
            <h2
              ref={headingRef}
              className="section-title-3d location-heading editorial-heading mt-6 font-display text-[clamp(3rem,13vw,7.8rem)] tracking-[-0.04em] text-heading sm:text-[clamp(4rem,7vw,7.8rem)]"
              data-title-visible={isHeadingVisible ? "true" : "false"}
              data-visible={isHeadingVisible ? "true" : "false"}
            >
              <span className="location-heading-line">Close to the city.</span>
              <span className="location-heading-line">Closer to calm.</span>
            </h2>
          </div>
          <div className="xl:justify-self-end">
            <p className="max-w-md text-sm leading-7">{site.fullAddress}</p>
            <a
              className="location-map-link mt-5"
              href={site.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Saanidhya Greens location on Google Maps"
            >
              Open in Google Maps <span aria-hidden="true">↗</span>
            </a>
            <ul className="location-connection-list mt-8 grid grid-cols-2 gap-3 text-xs font-semibold uppercase tracking-[0.08em]">
              {LOCATION_PINS.map((pin) => {
                const isActive = activePinId === pin.id;
                return (
                  <li key={pin.id}>
                    <button
                      type="button"
                      className="location-connection-button"
                      aria-pressed={isActive}
                      onClick={() => setActivePinId(pin.id)}
                    >
                      <span>{pin.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div
          ref={mapRef}
          className="location-map mt-20"
          data-dragging={isDragging ? "true" : "false"}
          data-visible={isMapVisible ? "true" : "false"}
          role="region"
          aria-label="Draggable brochure location map"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onLostPointerCapture={handlePointerCancel}
        >
          <div
            className="location-map-canvas"
            style={{ transform: `translate3d(${pan.x}px, ${pan.y}px, 0)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Location map showing Saanidhya Greens near Hansapura and the Vadodara-Dabhoi Main Road."
              draggable="false"
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
                color: "transparent",
              }}
              src="/images/image-31.webp"
            />
            <div className="location-map-grid" aria-hidden="true"></div>

            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {LOCATION_PINS.map((pin) => (
                <path key={pin.id} className="location-route-muted" d={pin.route} />
              ))}
              <path className="location-route-active" d={activePin.route} />
              <circle className="location-project-pulse" cx="74" cy="57" r="1.65" />
              <circle className="location-active-dot" cx={activePin.cx} cy={activePin.cy} r="1.15" />
            </svg>

            <div className="location-project-marker" style={{ left: "74%", top: "57%" }}>
              <span>Project site</span>
              <strong>Saanidhya Greens</strong>
            </div>

            {LOCATION_PINS.map((pin) => {
              const isActive = activePinId === pin.id;
              return (
                <button
                  key={pin.id}
                  type="button"
                  className="location-map-pin"
                  style={{ left: pin.left, top: pin.top }}
                  aria-pressed={isActive}
                  aria-label={`Show ${pin.name} on the location map`}
                  onClick={() => setActivePinId(pin.id)}
                >
                  <span className="location-pin-number">{pin.id}</span>
                  <span className="location-pin-label">{pin.name}</span>
                </button>
              );
            })}
          </div>

          <div className="location-project-card" aria-live="polite">
            <span className="location-card-tag">{activePin.tag}</span>
            <strong>Saanidhya Greens</strong>
            <p>{site.fullAddress}</p>
            <div>
              <span>{activePin.name}</span>
              <small>{activePin.detail}</small>
            </div>
            <a
              className="location-map-link location-card-map-link"
              href={site.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Explore Saanidhya Greens on Google Maps"
            >
              Explore on Maps <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
