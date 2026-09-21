import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsap-client";
import { useScene } from "@/lib/scene-store";
import { prefersReducedMotion } from "@/lib/utils";
import { WebGLFrame } from "@/components/meow/WebGLFrame";

const loadHero = () => import("@/components/three/HeroCanvas");

function HeroFallback() {
  return (
    <img
      src="/images/hero-bar.jpg"
      alt="A floating MEOW chocolate bar"
      className="h-full w-full object-cover"
    />
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const setHero = useScene((s) => s.setHero);
  const ready = useScene((s) => s.ready);

  useEffect(() => {
    if (!ready) return;
    const { gsap, ScrollTrigger } = getGsap();
    const section = sectionRef.current;
    const copy = copyRef.current;
    if (!section || !copy) return;

    if (prefersReducedMotion()) {
      setHero(0.35);
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(copy, {
        y: -140,
        opacity: 0,
        scale: 0.92,
        filter: "blur(8px)",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "60% top",
          scrub: 0.6,
        },
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.65,
        onUpdate: (self) => setHero(self.progress),
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, [ready, setHero]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative h-[220vh] md:h-[280vh]"
      aria-label="MEOW hero"
    >
      <div className="meow-scene sticky top-0 h-dvh overflow-hidden meow-atmosphere">
        <WebGLFrame
          importer={loadHero}
          className="absolute inset-0"
          fallback={<HeroFallback />}
        />
        <div
          ref={copyRef}
          className="relative z-10 flex h-full flex-col items-center justify-start px-6 pt-[18vh] text-center md:pt-[16vh]"
        >
          <p className="mb-4 text-[11px] tracking-[0.42em] text-caramel uppercase">
            Est. for cravings
          </p>
          <h1 className="font-display max-w-full text-[17vw] leading-[0.8] font-extrabold tracking-[-0.07em] text-cream md:text-[10.5rem]">
            MEOW
          </h1>
          <p className="mt-6 max-w-md text-sm tracking-[0.18em] text-cream-dim uppercase md:text-base">
            Chocolate, but with a little attitude.
          </p>
        </div>
      </div>
    </section>
  );
}
