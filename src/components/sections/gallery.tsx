"use client";

import { useRef, useState } from "react";

const GALLERY_ITEMS = [
  {
    index: "01",
    angle: "0deg",
    image: "/images/image-03.webp",
    alt: "Sunset aerial view of the Saanidhya Greens clubhouse, sports courts and surrounding landscape.",
    position: "50% 50%",
  },
  {
    index: "02",
    angle: "60deg",
    image: "/images/image-19.webp",
    alt: "A planted resort clubhouse surrounded by courts, pool gardens and open lawn.",
    position: "50% 48%",
  },
  {
    index: "03",
    angle: "120deg",
    image: "/images/image-11.webp",
    alt: "Daytime clubhouse arrival with pool terrace, landscaped lawns and road frontage.",
    position: "50% 50%",
  },
  {
    index: "04",
    angle: "180deg",
    image: "/images/image-21.webp",
    alt: "Warm clubhouse lounge and dining space with sculptural lighting and natural finishes.",
    position: "50% 50%",
  },
  {
    index: "05",
    angle: "240deg",
    image: "/images/image-22.webp",
    alt: "Indoor fitness and wellbeing studio with gym equipment, warm lighting and open training zones.",
    position: "50% 50%",
  },
  {
    index: "06",
    angle: "300deg",
    image: "/images/image-23.webp",
    alt: "Indoor recreation room with pool tables, board games and social seating.",
    position: "50% 50%",
  },
];

export function GallerySection() {
  const [activeRotationIndex, setActiveRotationIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const rotatePrev = () => {
    setActiveRotationIndex((prev) => (prev > 0 ? prev - 1 : GALLERY_ITEMS.length - 1));
  };

  const rotateNext = () => {
    setActiveRotationIndex((prev) => (prev < GALLERY_ITEMS.length - 1 ? prev + 1 : 0));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    if (dialogRef.current && dialogRef.current.open) {
      dialogRef.current.close();
    }
  };

  const currentLightboxItem = lightboxIndex !== null ? GALLERY_ITEMS[lightboxIndex] : null;

  return (
    <section id="gallery" className="page-gutter bg-night py-28 text-white md:py-40" data-theme="dark">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow text-white/50">11 · Gallery</p>
            <h2 className="editorial-heading mt-6 font-display text-[clamp(4.5rem,8vw,8.5rem)] tracking-[-0.045em]">
              A landscape for every rhythm.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-white/58">
            Architecture, garden, water, sport and celebration—different expressions of the same considered world.
          </p>
        </div>

        <div className="gallery-immersive mt-20" aria-label="Auto-rotating gallery">
          <button
            className="gallery-nav gallery-nav-prev"
            aria-label="Show previous gallery image"
            type="button"
            onClick={rotatePrev}
          >
            ←
          </button>

          <div
            className="gallery-orbit"
            style={{ "--gallery-rotation": `${activeRotationIndex * -60}deg` } as React.CSSProperties}
          >
            {GALLERY_ITEMS.map((item, idx) => {
              const isActive = activeRotationIndex === idx;
              return (
                <button
                  key={item.index}
                  type="button"
                  className="gallery-panel"
                  style={{ "--gallery-panel-angle": item.angle } as React.CSSProperties}
                  data-active={isActive ? "true" : "false"}
                  aria-label={`Open gallery image ${idx + 1}: ${item.alt}`}
                  onClick={() => openLightbox(idx)}
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
                      objectPosition: item.position,
                      color: "transparent",
                    }}
                    src={item.image}
                  />
                  <span>{item.index}</span>
                </button>
              );
            })}
          </div>

          <div className="gallery-mobile-strip">
            {GALLERY_ITEMS.map((item, idx) => {
              const isActive = activeRotationIndex === idx;
              return (
                <button
                  key={item.index}
                  className="gallery-mobile-panel"
                  data-active={isActive ? "true" : "false"}
                  aria-label={`Open gallery image ${idx + 1}: ${item.alt}`}
                  type="button"
                  onClick={() => openLightbox(idx)}
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
                      objectPosition: item.position,
                      color: "transparent",
                    }}
                    src={item.image}
                  />
                  <span>{item.index}</span>
                </button>
              );
            })}
          </div>

          <button
            className="gallery-nav gallery-nav-next"
            aria-label="Show next gallery image"
            type="button"
            onClick={rotateNext}
          >
            →
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="gallery-dialog"
        aria-label="Gallery image viewer"
        onClick={(e) => {
          if (e.target === dialogRef.current) closeLightbox();
        }}
      >
        <button className="gallery-close" aria-label="Close gallery" onClick={closeLightbox}>
          ×
        </button>

        <button
          className="gallery-prev"
          aria-label="Previous image"
          onClick={() => {
            if (lightboxIndex !== null) {
              setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : GALLERY_ITEMS.length - 1);
            }
          }}
        >
          ←
        </button>

        <div className="gallery-swipe-surface relative h-[78svh] w-[min(86vw,1350px)] overflow-hidden">
          {currentLightboxItem && (
            <div className="absolute inset-0" style={{ opacity: 1, transform: "none" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={currentLightboxItem.image}
                alt={currentLightboxItem.alt}
                loading="lazy"
                decoding="async"
                className="object-contain"
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
                src={currentLightboxItem.image}
              />
            </div>
          )}
        </div>

        <button
          className="gallery-next"
          aria-label="Next image"
          onClick={() => {
            if (lightboxIndex !== null) {
              setLightboxIndex(lightboxIndex < GALLERY_ITEMS.length - 1 ? lightboxIndex + 1 : 0);
            }
          }}
        >
          →
        </button>

        {currentLightboxItem && (
          <p className="mt-4 text-center text-xs tracking-[0.08em] text-white/65">
            {currentLightboxItem.alt}
          </p>
        )}
      </dialog>
    </section>
  );
}
