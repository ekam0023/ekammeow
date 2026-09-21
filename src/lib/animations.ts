import { getGsap } from "@/lib/gsap-client";
import { prefersReducedMotion } from "@/lib/utils";

export function revealLines(
  root: HTMLElement,
  selector: string,
  trigger?: HTMLElement,
) {
  if (prefersReducedMotion()) return () => {};
  const { gsap } = getGsap();
  const tween = gsap.fromTo(
    root.querySelectorAll(selector),
    { y: 36, opacity: 0, filter: "blur(8px)" },
    {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      stagger: 0.1,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: trigger ?? root,
        start: "top 75%",
      },
    },
  );
  return () => {
    tween.kill();
  };
}
