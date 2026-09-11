/**
 * Smooth scroll utility mimicking the fast exponential-out easing curve
 * used by Lenis in the original site (1 - 2^(-10t)), providing a snappy,
 * responsive launch and buttery smooth deceleration.
 */

let activeAnimationId: number | null = null;
let activeCleanup: (() => void) | null = null;

export function cancelSmoothScroll() {
  if (activeAnimationId !== null) {
    cancelAnimationFrame(activeAnimationId);
    activeAnimationId = null;
  }
  if (activeCleanup) {
    activeCleanup();
    activeCleanup = null;
  }
}

export function smoothScrollTo(
  targetY: number,
  options: {
    duration?: number;
    onComplete?: () => void;
  } = {}
) {
  if (typeof window === "undefined") return;

  const duration = options.duration ?? 850;

  // Respect user preference for reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    cancelSmoothScroll();
    window.scrollTo({ top: targetY, behavior: "auto" });
    options.onComplete?.();
    return;
  }

  // Cancel any prior scroll animation
  cancelSmoothScroll();

  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );
  const clampedTargetY = Math.min(Math.max(0, targetY), maxScroll);
  const startY = window.scrollY;
  const distance = clampedTargetY - startY;

  // If already at or very close to target, finish immediately
  if (Math.abs(distance) < 2) {
    window.scrollTo({ top: clampedTargetY, behavior: "auto" });
    options.onComplete?.();
    return;
  }

  const startTime = performance.now();

  // Exact Lenis Expo-out easing curve:
  // Starts immediately with fast momentum and smoothly decelerates
  const easeOutExpo = (t: number) => {
    return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
  };

  const handleInterrupt = () => {
    cancelSmoothScroll();
  };

  // Allow user interactions (wheel, touch drag, key scroll) to naturally cancel animation
  window.addEventListener("wheel", handleInterrupt, { passive: true, once: true });
  window.addEventListener("touchmove", handleInterrupt, { passive: true, once: true });
  window.addEventListener("keydown", handleInterrupt, { passive: true, once: true });

  activeCleanup = () => {
    window.removeEventListener("wheel", handleInterrupt);
    window.removeEventListener("touchmove", handleInterrupt);
    window.removeEventListener("keydown", handleInterrupt);
  };

  const step = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutExpo(progress);

    const currentY = startY + distance * eased;
    window.scrollTo(0, currentY);

    if (progress < 1) {
      activeAnimationId = requestAnimationFrame(step);
    } else {
      activeAnimationId = null;
      if (activeCleanup) {
        activeCleanup();
        activeCleanup = null;
      }
      options.onComplete?.();
    }
  };

  activeAnimationId = requestAnimationFrame(step);
}

export function smoothScrollToTarget(
  targetSelectorOrId: string,
  options: { duration?: number; onComplete?: () => void } = {}
) {
  if (typeof window === "undefined") return;

  if (targetSelectorOrId === "#" || targetSelectorOrId === "#hero" || targetSelectorOrId === "#top") {
    smoothScrollTo(0, options);
    return;
  }

  const selector = targetSelectorOrId.startsWith("#")
    ? targetSelectorOrId
    : `#${targetSelectorOrId}`;

  const el = document.querySelector<HTMLElement>(selector);
  if (el) {
    const rect = el.getBoundingClientRect();
    const targetY = rect.top + window.scrollY;
    smoothScrollTo(targetY, options);
  }
}
