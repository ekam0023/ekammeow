import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsap-client";
import { prefersReducedMotion } from "@/lib/utils";
import { useScene } from "@/lib/scene-store";
import { WebGLFrame } from "@/components/meow/WebGLFrame";

const loadAbstract = () => import("@/components/three/AbstractCanvas");

function AbstractFallback() {
  return (
    <img
      src="/images/abstract.jpg"
      alt="Abstract glossy chocolate forms floating in space"
      className="h-full w-full object-cover"
    />
  );
}

export function AbstractWorld() {
  const sectionRef = useRef<HTMLElement>(null);
  const setAbstract = useScene((s) => s.setAbstract);
  const ready = useScene((s) => s.ready);

  useEffect(() => {
    if (!ready) return;
    const section = sectionRef.current;
    if (!section) return;
    const { gsap, ScrollTrigger } = getGsap();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.7,
        onUpdate: (self) => setAbstract(self.progress),
      });
      gsap.fromTo(
        ".abstract-copy",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            end: "center center",
            scrub: 0.6,
          },
        },
      );
    }, section);
    return () => ctx.revert();
  }, [ready, setAbstract]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[160vh] md:h-[180vh]"
      aria-label="Abstract chocolate universe"
    >
      <div className="meow-scene sticky top-0 h-dvh overflow-hidden">
        <WebGLFrame
          importer={loadAbstract}
          className="absolute inset-0"
          fallback={<AbstractFallback />}
        />
        <div className="relative z-10 flex h-full items-end px-6 pb-16 md:px-16 md:pb-24">
          <div className="abstract-copy max-w-xl">
            <p className="text-[11px] tracking-[0.3em] text-aqua uppercase">
              The universe
            </p>
            <h2 className="font-display mt-4 text-4xl font-bold md:text-6xl">
              A little chaos,
              <br />
              held together by cocoa.
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
