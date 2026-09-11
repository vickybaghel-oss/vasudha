"use client";

import { useEffect, useState } from "react";

export function PageLoader() {
  const [phase, setPhase] = useState<"loading" | "leaving" | "done">("loading");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let loaded = false;
    let rafId = 0;
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resources = [
      document.fonts ? document.fonts.ready : Promise.resolve(),
      new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = "/images/image-03.webp";
      }),
    ];

    if (reducedMotion) {
      queueMicrotask(() => {
        if (!cancelled) {
          setProgress(100);
          setPhase("leaving");
        }
      });
      return () => {
        cancelled = true;
      };
    }

    Promise.allSettled(resources).then(() => {
      if (!cancelled) loaded = true;
    });

    const startTime = window.performance.now();

    const tick = (now: number) => {
      if (cancelled) return;
      const elapsed = now - startTime;
      // Cubic ease out curve
      const calculated = Math.min(
        loaded ? 100 : 98,
        Math.round(100 * (1 - Math.pow(1 - Math.min(1, elapsed / 2600), 3)))
      );
      setProgress(calculated);

      if ((loaded && calculated >= 100) || elapsed >= 4500) {
        setProgress(100);
        setPhase("leaving");
        return;
      }
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    const timeout = window.setTimeout(() => {
      if (!cancelled) {
        setProgress(100);
        setPhase("leaving");
      }
    }, 4800);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (phase !== "leaving") return;
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeout = window.setTimeout(
      () => setPhase("done"),
      1250 * (reducedMotion ? 0 : 1)
    );
    return () => window.clearTimeout(timeout);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <>
      <noscript>
        <style>{`.page-loader { display: none !important; }`}</style>
      </noscript>
      <div
        className="page-loader"
        data-phase={phase}
        style={{ "--loader-progress": `${progress}%` } as React.CSSProperties}
        aria-hidden="true"
        onTransitionEnd={(e) => {
          if (e.target === e.currentTarget && phase === "leaving") {
            setPhase("done");
          }
        }}
      >
        <div className="loader-panel loader-panel-left" />
        <div className="loader-panel loader-panel-right" />
        <div className="loader-content">
          <p className="loader-wordmark">Saanidhya Greens</p>
          <div className="loader-building-stage">
            <div className="loader-building-reveal">
              <svg className="loader-building-model" viewBox="0 0 360 280" aria-hidden="true">
                <defs>
                  <linearGradient id="loader-wall" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#f4eadc" />
                    <stop offset="100%" stopColor="#c8a984" />
                  </linearGradient>
                  <linearGradient id="loader-glass" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#eaf1e4" />
                    <stop offset="100%" stopColor="#6f8a61" />
                  </linearGradient>
                </defs>
                <ellipse cx="180" cy="254" rx="126" ry="15" className="loader-building-shadow" />
                <path d="M64 116 180 58l116 58v121L180 258 64 237Z" className="loader-building-base" />
                <path d="M64 116 180 58v200L64 237Z" className="loader-building-left" />
                <path d="M180 58 296 116v121L180 258Z" className="loader-building-right" />
                <path d="M91 130 158 96v128l-67-12Z" className="loader-building-glass" />
                <path d="M202 96 269 130v82l-67 12Z" className="loader-building-glass loader-building-glass-right" />
                <path d="M151 147h58v111h-58Z" className="loader-building-portal" />
                <path d="M108 151h20v52h-20Zm35-18h20v77h-20Zm91 0h20v77h-20Zm35 18h20v52h-20Z" className="loader-building-slats" />
                <path d="M50 116 180 43l130 73" className="loader-building-roof" />
                <path d="M83 234c34-18 62-16 97 8 34-24 64-26 99-8" className="loader-building-landscape" />
              </svg>
            </div>
          </div>
          <p className="loader-percent">{progress.toString().padStart(3, "0")}</p>
        </div>
      </div>
    </>
  );
}
