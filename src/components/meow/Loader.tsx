import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsap-client";
import { prefersReducedMotion } from "@/lib/utils";
import { useScene } from "@/lib/scene-store";

export function Loader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const setReady = useScene((s) => s.setReady);
  const ready = useScene((s) => s.ready);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const { gsap } = getGsap();
    const root = rootRef.current;
    if (!root) return;

    document.documentElement.style.overflow = "hidden";

    const failsafe = window.setTimeout(() => {
      document.documentElement.style.overflow = "";
      document.documentElement.dataset.meowReady = "true";
      setReady(true);
    }, 2500);

    if (reduced) {
      window.clearTimeout(failsafe);
      gsap.set(root, { autoAlpha: 0 });
      document.documentElement.style.overflow = "";
      document.documentElement.dataset.meowReady = "true";
      setReady(true);
      return () => window.clearTimeout(failsafe);
    }

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        window.clearTimeout(failsafe);
        document.documentElement.style.overflow = "";
        document.documentElement.dataset.meowReady = "true";
        setReady(true);
      },
    });

    tl.fromTo(
      ".loader-word",
      { y: 36, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.45 },
    )
      .fromTo(
        ".loader-dot",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.28 },
        "-=0.18",
      )
      .fromTo(
        barRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.85, ease: "power2.inOut" },
        "-=0.12",
      )
      .to(
        root,
        { yPercent: -110, duration: 0.7, ease: "power4.inOut" },
        "+=0.12",
      );

    return () => {
      window.clearTimeout(failsafe);
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  }, [setReady]);

  if (ready) return null;

  return (
    <div
      ref={rootRef}
      className="meow-loader fixed inset-0 z-loader flex flex-col items-center justify-center bg-cocoa-deep"
      role="status"
      aria-live="polite"
      aria-label="Loading MEOW"
    >
      <p className="loader-word font-display max-w-full px-4 text-[16vw] leading-none font-extrabold tracking-[-0.06em] text-cream md:text-[9rem]">
        MEOW
      </p>
      <span
        className="loader-dot mt-6 block h-2 w-2 rounded-full bg-caramel"
        aria-hidden="true"
      />
      <div className="mt-10 h-px w-40 overflow-hidden bg-cream/15">
        <div ref={barRef} className="loader-bar h-full w-full bg-cream" />
      </div>
    </div>
  );
}
