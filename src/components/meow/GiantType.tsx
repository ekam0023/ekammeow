import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsap-client";
import { prefersReducedMotion } from "@/lib/utils";
import { useScene } from "@/lib/scene-store";

const ORBS = [
  { src: "/images/hero-bar.jpg", className: "top-[12%] left-[8%] w-36 md:w-52 -rotate-12" },
  { src: "/images/original.jpg", className: "top-[18%] right-[6%] w-28 md:w-44 rotate-8" },
  { src: "/images/caramel.jpg", className: "bottom-[18%] left-[18%] w-32 md:w-48 rotate-[-6deg]" },
  { src: "/images/dark.jpg", className: "right-[16%] bottom-[12%] w-24 md:w-40 rotate-12" },
] as const;

export function GiantType() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const ready = useScene((s) => s.ready);

  useEffect(() => {
    if (!ready) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.to(track, {
        xPercent: -42,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=160%",
          pin: true,
          scrub: 0.7,
        },
      });
      gsap.utils.toArray<HTMLElement>(".giant-orb").forEach((orb, i) => {
        gsap.to(orb, {
          y: i % 2 === 0 ? -80 : 90,
          x: i % 2 === 0 ? 40 : -50,
          rotate: i % 2 === 0 ? 12 : -14,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=160%",
            scrub: 0.8,
          },
        });
      });
    }, section);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      className="relative h-dvh overflow-x-hidden overflow-y-hidden bg-cocoa"
      aria-label="MEOW wordmark"
    >
      {ORBS.map((orb) => (
        <img
          key={orb.className}
          src={orb.src}
          alt=""
          className={`giant-orb pointer-events-none absolute z-20 rounded-full object-cover shadow-2xl ${orb.className} aspect-square`}
        />
      ))}
      <div
        ref={trackRef}
        className="relative z-10 flex h-full items-center whitespace-nowrap"
      >
        <p className="font-display px-[8vw] text-[42vw] leading-none font-extrabold tracking-[-0.08em] text-cream md:text-[28vw]">
          MEOW MEOW
        </p>
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <div className="absolute top-1/4 left-1/3 h-64 w-64 rounded-full bg-iris/30 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-caramel/25 blur-3xl" />
      </div>
    </section>
  );
}
