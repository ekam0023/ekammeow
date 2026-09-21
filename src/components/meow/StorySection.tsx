import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsap-client";
import { prefersReducedMotion } from "@/lib/utils";
import { useScene } from "@/lib/scene-store";

const LINES = [
  "IT STARTED",
  "WITH A",
  "CRAVING.",
];

export function StorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const ready = useScene((s) => s.ready);

  useEffect(() => {
    if (!ready) return;
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".story-line",
        { y: 80, opacity: 0, filter: "blur(12px)", clipPath: "inset(0 0 100% 0)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          clipPath: "inset(0 0 0% 0)",
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "center center",
            scrub: 0.7,
          },
        },
      );
      gsap.fromTo(
        ".story-support",
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: section,
            start: "center 70%",
            end: "center 40%",
            scrub: 0.6,
          },
        },
      );
    }, section);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative flex min-h-[100dvh] flex-col justify-center bg-cocoa px-6 py-28 md:px-16"
    >
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="font-display text-[11.5vw] leading-[0.86] font-extrabold tracking-[-0.05em] md:text-[8.4rem]">
          {LINES.map((line) => (
            <span key={line} className="story-line block">
              {line}
            </span>
          ))}
        </h2>
        <p className="story-support mt-10 max-w-sm text-base leading-relaxed text-cream-dim md:text-lg">
          Not another chocolate.
          <br />
          A little moment of chaos,
          <br />
          wrapped in something delicious.
        </p>
      </div>
    </section>
  );
}
