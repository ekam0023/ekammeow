import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsap-client";
import { prefersReducedMotion } from "@/lib/utils";
import { useScene } from "@/lib/scene-store";
import { useLenis } from "@/components/meow/SmoothScroll";
import { MagneticButton } from "@/components/meow/MagneticButton";
import { WebGLFrame } from "@/components/meow/WebGLFrame";

const loadCta = () => import("@/components/three/CtaCanvas");

function CtaFallback() {
  return (
    <img
      src="/images/hero-bar.jpg"
      alt=""
      className="float-slow mx-auto h-[50vh] w-auto object-contain"
    />
  );
}

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const ready = useScene((s) => s.ready);
  const setCta = useScene((s) => s.setCta);
  const lenis = useLenis();

  useEffect(() => {
    if (!ready) return;
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    const { ScrollTrigger } = getGsap();
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.7,
      onUpdate: (self) => setCta(self.progress),
    });
    return () => trigger.kill();
  }, [ready, setCta]);

  const goShop = () => {
    const el = document.querySelector("#shop");
    if (!el) return;
    if (lenis) lenis.scrollTo(el as HTMLElement);
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-[160vh] bg-cocoa-deep"
      aria-labelledby="cta-title"
    >
      <div className="meow-scene sticky top-0 flex h-dvh flex-col items-center justify-center overflow-hidden">
        <WebGLFrame
          importer={loadCta}
          className="absolute inset-0"
          fallback={<CtaFallback />}
        />
        <div className="relative z-10 px-6 text-center">
          <h2
            id="cta-title"
            className="font-display text-6xl leading-[0.9] font-extrabold md:text-8xl"
          >
            READY TO
            <br />
            MEOW?
          </h2>
          <MagneticButton className="mt-10" data-cursor="CLICK" onClick={goShop}>
            Shop chocolate
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
