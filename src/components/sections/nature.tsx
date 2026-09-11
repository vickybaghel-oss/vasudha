export function NatureStory() {
  return (
    <section id="nature" className="nature-story" data-theme="light" data-editorial-scene="true">
      <div className="nature-stage">
        <div className="nature-sentences nature-panel">
          <p className="nature-eyebrow">Retreat to nature</p>
          <h2 className="nature-sentence">Nature is not the weekend here.</h2>
          <div className="nature-card-strip" aria-label="Saanidhya Greens landscape moments">
            <figure className="nature-card nature-card-left">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Private theatre seating with warm acoustic wall panels at Saanidhya Greens."
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
                src="/images/image-05.webp"
              />
            </figure>
            <figure className="nature-card nature-card-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Green arrival arch and landscaped driveway at Saanidhya Greens during sunset."
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
                src="/images/image-06.webp"
              />
            </figure>
            <figure className="nature-card nature-card-right">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Modern gym interior with cardio and strength equipment at Saanidhya Greens."
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
                src="/images/image-07.webp"
              />
            </figure>
          </div>
          <p className="nature-copy">
            Urban access stays close, while the everyday rhythm slows into gardens, open skies and an unhurried plotted lifestyle.
          </p>
        </div>
      </div>
    </section>
  );
}
