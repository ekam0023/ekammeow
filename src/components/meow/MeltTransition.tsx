import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsap-client";
import { prefersReducedMotion } from "@/lib/utils";
import { useScene } from "@/lib/scene-store";

export function MeltTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const ready = useScene((s) => s.ready);

  useEffect(() => {
    if (!ready) return;
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".melt-photo",
        { yPercent: 20, scale: 1.15 },
        {
          yPercent: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        },
      );
      gsap.fromTo(
        pathRef.current,
        { y: 180 },
        {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom top",
            scrub: 0.9,
          },
        },
      );
    }, section);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[70vh] overflow-hidden md:h-[90vh]"
      aria-hidden="true"
    >
      <img
        src="/images/melt.jpg"
        alt=""
        className="melt-photo absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-b from-cocoa-deep via-transparent to-cocoa-deep" />
      <svg
        className="absolute inset-x-0 bottom-0 h-[55%] w-full"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          fill="#140A08"
          d="M0,160 C180,240 320,80 520,150 C720,220 820,40 1040,130 C1200,190 1320,90 1440,140 L1440,400 L0,400 Z"
        />
      </svg>
    </section>
  );
}
