import { useEffect, useRef, useState } from "react";
import { isCoarsePointer, prefersReducedMotion } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [hovering, setHovering] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (isCoarsePointer() || prefersReducedMotion()) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let raf = 0;

    const onMove = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-cursor]",
      );
      if (target) {
        setHovering(true);
        setLabel(target.dataset.cursor ?? "");
      } else {
        setHovering(false);
        setLabel("");
      }
    };

    const loop = () => {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      className="meow-cursor pointer-events-none fixed top-0 left-0 z-cursor mix-blend-difference"
      aria-hidden="true"
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full border border-cream/80 bg-cream text-cocoa-deep transition-[width,height,background-color,border-color] duration-200 ease-out",
          hovering ? "h-16 w-16" : "h-2.5 w-2.5 bg-cream",
        )}
        style={{ marginLeft: hovering ? -32 : -5, marginTop: hovering ? -32 : -5 }}
      >
        {hovering && label ? (
          <span className="font-display text-[9px] font-semibold tracking-[0.22em]">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
