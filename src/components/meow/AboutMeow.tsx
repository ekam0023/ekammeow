import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsap-client";
import { prefersReducedMotion } from "@/lib/utils";
import { useScene } from "@/lib/scene-store";

export function AboutMeow() {
  const sectionRef = useRef<HTMLElement>(null);
  const ready = useScene((s) => s.ready);

  useEffect(() => {
    if (!ready) return;
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-line",
        { y: 40, opacity: 0, clipPath: "inset(0 0 100% 0)" },
        {
          y: 0,
          opacity: 1,
          clipPath: "inset(0 0 0% 0)",
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "center 55%",
            scrub: 0.7,
          },
        },
      );
    }, section);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative bg-cocoa-deep px-6 py-28 md:px-16 md:py-40"
    >
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.4fr_1fr] md:items-end">
        <h2 className="font-display text-5xl leading-[0.92] font-bold md:text-7xl">
          <span className="about-line block">WE TAKE CHOCOLATE</span>
          <span className="about-line block">A LITTLE TOO</span>
          <span className="about-line block text-caramel">SERIOUSLY.</span>
        </h2>
        <div className="about-line max-w-sm pb-2">
          <p className="text-sm leading-relaxed text-cream-dim">
            MEOW began as a late-night experiment and refused to stay a secret.
            We roast small, temper slower than we should, and name bars like
            they have personalities — because they do.
          </p>
          <p className="mt-5 text-sm leading-relaxed text-cream-dim">
            Born from cocoa. Finished with attitude.
          </p>
        </div>
      </div>
    </section>
  );
}
