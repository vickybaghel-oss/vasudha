export function PhilosophySection() {
  return (
    <section id="philosophy" className="philosophy-section" data-theme="light" aria-labelledby="philosophy-title">
      <div className="philosophy-inner">
        <div className="philosophy-lead">
          <div className="philosophy-copy-block">
            <p className="philosophy-eyebrow">Philosophy</p>
            <h2 id="philosophy-title">A dialogue between nature and architecture.</h2>
            <p className="philosophy-intro">
              Saanidhya is more than a plotted address; it is a curated experience designed to bring quiet, greenery and resort-like leisure into the rituals of everyday life.
            </p>
            <dl className="philosophy-stats" aria-label="Saanidhya Greens experience highlights">
              <div>
                <dt>
                  <span className="philosophy-stat-number" aria-label="24+" style={{ minWidth: "3ch" }}>
                    24+
                  </span>
                </dt>
                <dd>Modern amenities</dd>
              </div>
              <div>
                <dt>
                  <span className="philosophy-stat-number" aria-label="05" style={{ minWidth: "2ch" }}>
                    05
                  </span>
                </dt>
                <dd>Club lifestyle moods</dd>
              </div>
              <div>
                <dt>
                  <span className="philosophy-stat-number" aria-label="03" style={{ minWidth: "2ch" }}>
                    03
                  </span>
                </dt>
                <dd>Recreation arenas</dd>
              </div>
            </dl>
          </div>
          <figure className="philosophy-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Sculptural arrival stairway and landscaped edge at Saanidhya Greens during sunset."
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
              src="/images/image-04.webp"
            />
          </figure>
        </div>
        <div className="philosophy-cards">
          <article className="philosophy-card">
            <span aria-hidden="true">01</span>
            <h3>Wellness Sanctuary</h3>
            <p>Poolside pauses, yoga lawns and quiet garden edges create a slower rhythm for everyday renewal.</p>
          </article>
          <article className="philosophy-card">
            <span aria-hidden="true">02</span>
            <h3>Layered Landscape</h3>
            <p>Open greens, shaded walks and planted social spaces soften the plotted community from arrival to clubhouse.</p>
          </article>
          <article className="philosophy-card">
            <span aria-hidden="true">03</span>
            <h3>Smart Living</h3>
            <p>Planned infrastructure, internal RCC roads and 24×7 security support a contemporary life with ease.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
