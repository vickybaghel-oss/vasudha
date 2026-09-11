export function ClubLifestyle() {
  return (
    <section id="lifestyle" className="club-story bg-background" data-theme="light">
      <div className="club-stage">
        <div className="club-visual absolute inset-0" style={{ opacity: 1, transform: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Daytime clubhouse arrival with pool terrace, landscaped lawns and road frontage."
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
            src="/images/image-11.webp"
          />
        </div>
        <div className="club-entrance-glass" data-active="true" aria-hidden="true" style={{ opacity: 1 }}></div>
        <p className="club-counter" aria-hidden="true">
          01 / 05
        </p>
        <div className="page-gutter absolute inset-x-0 top-24 z-10">
          <p className="eyebrow text-white/55">04 · Club lifestyle</p>
          <h2 className="reveal-text editorial-heading editorial-heading-compact club-heading mt-5 font-display text-[clamp(4rem,7vw,7.5rem)] tracking-[-0.04em] text-white">
            <span>A culture&nbsp;of belonging.</span>
          </h2>
        </div>
      </div>
      <div className="club-chapters">
        <article className="club-chapter">
          <span>01</span>
          <h3>Arrival</h3>
          <p>A planted threshold sets the pace for a slower, more considered way of living.</p>
        </article>
        <article className="club-chapter">
          <span>02</span>
          <h3>Lounge</h3>
          <p>Layered rooms invite conversation, reading and easy afternoons together.</p>
        </article>
        <article className="club-chapter">
          <span>03</span>
          <h3>Wellbeing</h3>
          <p>Fitness, yoga, pool and spa experiences form a daily ritual of renewal.</p>
        </article>
        <article className="club-chapter">
          <span>04</span>
          <h3>Recreation</h3>
          <p>Indoor games and outdoor courts bring every generation into play.</p>
        </article>
        <article className="club-chapter">
          <span>05</span>
          <h3>Suites</h3>
          <p>Quiet guest suites extend the comfort of the club to visiting family and friends.</p>
        </article>
      </div>
    </section>
  );
}
