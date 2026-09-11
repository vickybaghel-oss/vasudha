export function LuxuryStory() {
  return (
    <section id="luxury" className="luxury-story" data-theme="light" data-editorial-scene="true">
      <div className="luxury-grid">
        <div className="luxury-image-primary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Warm private suite with layered wood ceiling, lounge seating and garden-facing window."
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
            src="/images/image-08.webp"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/20"></div>
        </div>
        <div className="luxury-image-secondary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Clubhouse facade with poolside landscape and evening-lit architectural screens."
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
            src="/images/image-09.webp"
          />
        </div>
        <div className="luxury-copy">
          <p className="eyebrow text-accent">02 · Limitless luxury living</p>
          <h2 className="reveal-text editorial-heading mt-6 font-display text-[clamp(4.2rem,7vw,8rem)] tracking-[-0.045em] text-heading-secondary">
            <span>Room to live. Space to belong.</span>
          </h2>
          <div className="mt-12 grid gap-8 border-t border-heading/20 pt-8 sm:grid-cols-2">
            <p className="text-sm leading-7">
              A plotted community gives you the freedom to imagine a home around your own rituals, seasons and future.
            </p>
            <p className="text-sm leading-7">
              Beyond the plot, the clubhouse and resort landscape extend daily life into play, wellbeing and celebration.
            </p>
          </div>
          <p className="mt-14 font-display text-4xl italic text-heading">
            Crafted for the life between walls.
          </p>
        </div>
      </div>
    </section>
  );
}
