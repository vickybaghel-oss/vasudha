export function RefreshSection() {
  return (
    <section id="refresh" className="relative min-h-[105svh] overflow-hidden bg-night text-white" data-theme="dark">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt="Indoor recreation lounge with table tennis, pool tables and relaxed social seating."
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
        src="/images/image-12.webp"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-night/75 via-night/12 to-night/25"></div>
      <div className="water-caustics" data-moving="false" aria-hidden="true"></div>
      <div className="water-path" aria-hidden="true">
        <svg viewBox="0 0 900 180" preserveAspectRatio="none">
          <path id="water-route" d="M20 110 C180 20 290 170 440 90 S700 10 880 100"></path>
        </svg>
        <span></span>
      </div>
      <div className="page-gutter relative z-10 flex min-h-[105svh] flex-col justify-between py-28 md:py-36">
        <div>
          <p className="eyebrow text-white/55">06 · Refresh arena</p>
          <h2 className="editorial-heading mt-6 font-display text-[clamp(4.5rem,9vw,9rem)] tracking-[-0.045em]">
            The art of feeling renewed.
          </h2>
        </div>
        <div className="grid gap-5 border-t border-white/25 pt-7 sm:grid-cols-2 lg:grid-cols-6">
          <div className="flex items-center gap-3">
            <span className="text-[0.6rem] text-white/45">01</span>
            <p className="text-xs font-semibold tracking-[0.08em] uppercase">Restaurant</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[0.6rem] text-white/45">02</span>
            <p className="text-xs font-semibold tracking-[0.08em] uppercase">Swimming Pool</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[0.6rem] text-white/45">03</span>
            <p className="text-xs font-semibold tracking-[0.08em] uppercase">Baby Pool</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[0.6rem] text-white/45">04</span>
            <p className="text-xs font-semibold tracking-[0.08em] uppercase">Poolside Deck</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[0.6rem] text-white/45">05</span>
            <p className="text-xs font-semibold tracking-[0.08em] uppercase">Changing Rooms</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[0.6rem] text-white/45">06</span>
            <p className="text-xs font-semibold tracking-[0.08em] uppercase">Shower Facilities</p>
          </div>
        </div>
      </div>
    </section>
  );
}
