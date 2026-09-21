import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsap-client";
import { prefersReducedMotion } from "@/lib/utils";
import { useScene } from "@/lib/scene-store";
import { useLenis } from "@/components/meow/SmoothScroll";
import { MagneticButton } from "@/components/meow/MagneticButton";

export function TheBite() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const ready = useScene((s) => s.ready);
  const setBite = useScene((s) => s.setBite);
  const lenis = useLenis();

  useEffect(() => {
    if (!ready) return;
    const section = sectionRef.current;
    const img = imgRef.current;
    const copy = copyRef.current;
    if (!section || !img || !copy) return;
    if (prefersReducedMotion()) return;

    const { gsap, ScrollTrigger } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        img,
        { scale: 1.45, filter: "blur(2px)" },
        {
          scale: 1,
          filter: "blur(0px)",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
          },
        },
      );
      gsap.fromTo(
        copy,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: section,
            start: "center center",
            end: "70% center",
            scrub: 0.6,
          },
        },
      );
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => setBite(self.progress),
      });
    }, section);
    return () => ctx.revert();
  }, [ready, setBite]);

  const goShop = () => {
    const el = document.querySelector("#shop");
    if (!el) return;
    if (lenis) lenis.scrollTo(el as HTMLElement);
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-[180vh] bg-cocoa-deep md:h-[200vh]"
      aria-labelledby="bite-title"
    >
      <div className="sticky top-0 h-dvh overflow-hidden">
        <img
          ref={imgRef}
          src="/images/bite.jpg"
          alt="Extreme close-up of a bitten chocolate bar"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-cocoa-deep/25" />
        <div
          ref={copyRef}
          className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-20 text-center"
        >
          <p className="text-[11px] tracking-[0.32em] text-caramel uppercase">
            The bite
          </p>
          <h2
            id="bite-title"
            className="font-display mt-4 text-5xl font-bold md:text-7xl"
          >
            ONE MORE BITE?
          </h2>
          <p className="mt-4 text-lg text-cream-dim">You know you want it.</p>
          <MagneticButton
            className="mt-8"
            data-cursor="CLICK"
            onClick={goShop}
          >
            Shop MEOW
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
