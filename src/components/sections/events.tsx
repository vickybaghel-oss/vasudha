export function EventsStory() {
  return (
    <section id="events" className="events-story bg-night text-white" data-theme="dark">
      <div className="events-stage">
        <div className="event-image-mask">
          <div className="event-background absolute inset-0" style={{ opacity: 1, transform: "none" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Golden hour front view of the Saanidhya Greens clubhouse, lawn and arrival drive."
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
              src="/images/image-17.webp"
            />
          </div>
        </div>
        <div className="event-wipe-scrim" aria-hidden="true"></div>
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
              <div className="event-narrative" style={{ opacity: 1, transform: "none" }}>
                <p className="eyebrow">Celebration</p>
                <p>Milestones framed by garden, light and open sky.</p>
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
