import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsap-client";
import { prefersReducedMotion } from "@/lib/utils";
import { useScene } from "@/lib/scene-store";

export function ChocolateReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const ready = useScene((s) => s.ready);

  useEffect(() => {
    if (!ready) return;
    const section = sectionRef.current;
    const img = imgRef.current;
    if (!section || !img) return;
    if (prefersReducedMotion()) return;

    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        img,
        { scale: 1.18, rotate: -8, filter: "blur(8px)" },
        {
          scale: 1,
          rotate: 0,
          filter: "blur(0px)",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "center center",
            scrub: 0.8,
          },
        },
      );
      gsap.fromTo(
        ".reveal-copy",
        { y: 40, opacity: 0, clipPath: "inset(100% 0 0 0)" },
        {
          y: 0,
          opacity: 1,
          clipPath: "inset(0% 0 0 0)",
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-cocoa-deep px-6 py-24 md:px-12 md:py-36"
      aria-labelledby="reveal-title"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div>
          <p className="reveal-copy text-[11px] tracking-[0.3em] text-caramel uppercase">
            The unwrap
          </p>
          <h2
            id="reveal-title"
            className="reveal-copy font-display mt-4 text-4xl leading-[0.95] font-bold md:text-6xl"
          >
            Peel slowly.
            <br />
            Mean it.
          </h2>
          <p className="reveal-copy mt-6 max-w-sm text-base leading-relaxed text-cream-dim">
            A foil that catches the light. A bar that does not rush you. This is
            chocolate for people who like a little ceremony with their chaos.
          </p>
        </div>
        <div
          className="relative aspect-[3/2] overflow-hidden rounded-lg"
          data-cursor="EXPLORE"
        >
          <img
            ref={imgRef}
            src="/images/wrapper.jpg"
            alt="Gold foil peeling away from a MEOW chocolate bar"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
