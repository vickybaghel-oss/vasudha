export function HeroSection() {
  return (
    <section id="hero" className="hero-section" data-theme="dark">
      <div className="hero-stage">
        <div className="hero-copy">
          <p className="hero-kicker">Premium residential open plots / Vadodara</p>
          <h1 aria-label="Serenity flows into luxury">
            <span className="hero-title-line hero-title-line-primary">Serenity Flows</span>
            <span className="hero-title-row">
              <span>Into</span>
              <i aria-hidden="true"></i>
              <em>Luxury</em>
            </span>
          </h1>
        </div>
        <a className="hero-plan-link" href="#contact">
          Talk your plan <span aria-hidden="true">↗</span>
        </a>
        <aside className="hero-thumbnail-card" aria-label="Saanidhya Greens introduction">
          <a href="#luxury" className="hero-thumbnail" aria-label="Explore luxury living">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Sunset aerial view of the Saanidhya Greens clubhouse and landscaped arrival."
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
              src="/images/image-02.webp"
            />
            <span aria-hidden="true">→</span>
          </a>
          <p>
            Creating a plotted retreat with layered greens, resort amenities, and room for a life designed at your own pace.
          </p>
        </aside>
        <div className="hero-meta-row">
          <span>Est. 2026</span>
          <span>Luxury plotted residences</span>
          <span>Architectural precision</span>
        </div>
      </div>
      <div className="hero-scroll-image" data-initial-visible="25">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Sunset aerial view of the Saanidhya Greens clubhouse, sports courts and surrounding landscape."
          decoding="async"
          className="hero-scroll-image-media"
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
          src="/images/image-03.webp"
        />
      </div>
    </section>
  );
}
