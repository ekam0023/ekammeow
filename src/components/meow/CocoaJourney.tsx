import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsap-client";
import { prefersReducedMotion } from "@/lib/utils";
import { useScene } from "@/lib/scene-store";

const STAGES = [
  {
    id: "bean",
    label: "COCOA BEAN",
    copy: "Origin. Heat. A small, serious seed.",
    image: "/images/cocoa-beans.jpg",
    meta: "01 / FERMENT",
  },
  {
    id: "roast",
    label: "ROAST",
    copy: "Until the room smells like a promise.",
    image: "/images/cocoa-beans.jpg",
    meta: "02 / 128°C",
  },
  {
    id: "melt",
    label: "MELT",
    copy: "Patience, then a slow collapse into gloss.",
    image: "/images/melt.jpg",
    meta: "03 / CONCHE",
  },
  {
    id: "mix",
    label: "MIX",
    copy: "Milk, salt, caramel, crunch — pick a mood.",
    image: "/images/caramel.jpg",
    meta: "04 / RECIPE",
  },
  {
    id: "temper",
    label: "TEMPER",
    copy: "Snap, shine, that clean break you wait for.",
    image: "/images/dark.jpg",
    meta: "05 / 31.5°C",
  },
  {
    id: "meow",
    label: "MEOW",
    copy: "Wrapped. Named. Ready to misbehave.",
    image: "/images/hero-bar.jpg",
    meta: "06 / DONE",
  },
] as const;

export function CocoaJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const ready = useScene((s) => s.ready);

  useEffect(() => {
    if (!ready) return;
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      const stages = gsap.utils.toArray<HTMLElement>(".journey-stage");
      stages.forEach((stage, i) => {
        gsap.fromTo(
          stage.querySelector(".journey-visual"),
          { scale: 1.12, opacity: i === 0 ? 1 : 0.35 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: stage,
              start: "top 75%",
              end: "center center",
              scrub: 0.7,
            },
          },
        );
        gsap.fromTo(
          stage.querySelectorAll(".journey-copy"),
          { y: 32, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            stagger: 0.08,
            scrollTrigger: {
              trigger: stage,
              start: "top 70%",
              end: "top 35%",
              scrub: 0.6,
            },
          },
        );
      });
    }, section);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-cocoa-deep"
      aria-labelledby="journey-title"
    >
      <div className="px-6 pt-24 md:px-16 md:pt-32">
        <p className="text-[11px] tracking-[0.3em] text-caramel uppercase">
          Process
        </p>
        <h2
          id="journey-title"
          className="font-display mt-4 text-5xl leading-[0.9] font-bold md:text-7xl"
        >
          FROM COCOA
          <br />
          TO CRAVING.
        </h2>
      </div>

      <ol className="mt-16">
        {STAGES.map((stage, index) => (
          <li
            key={stage.id}
            className="journey-stage relative grid min-h-[80dvh] items-center gap-8 border-t border-cream/10 px-6 py-16 md:grid-cols-2 md:px-16"
          >
            <div>
              <p className="journey-copy font-mono text-[11px] tracking-[0.24em] text-caramel">
                {stage.meta}
              </p>
              <h3 className="journey-copy font-display mt-4 text-4xl font-bold md:text-6xl">
                {stage.label}
              </h3>
              <p className="journey-copy mt-4 max-w-sm text-cream-dim">
                {stage.copy}
              </p>
              {index < STAGES.length - 1 ? (
                <p className="journey-copy mt-10 text-xs tracking-[0.3em] text-cream/40">
                  ↓
                </p>
              ) : null}
            </div>
            <div className="journey-visual overflow-hidden rounded-lg">
              <img
                src={stage.image}
                alt=""
                className="h-[46vh] w-full object-cover md:h-[56vh]"
              />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
