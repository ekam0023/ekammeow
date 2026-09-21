import {
  type ButtonHTMLAttributes,
  type ReactNode,
  useRef,
} from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function MagneticButton({
  children,
  className,
  onMouseMove,
  onMouseLeave,
  type = "button",
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "relative inline-flex min-h-12 items-center justify-center rounded-full bg-cream px-7 text-sm font-semibold tracking-[0.16em] text-cocoa uppercase transition-[transform,background-color,color] duration-150 ease-out will-change-transform active:scale-[0.96]",
        className,
      )}
      onMouseMove={(event) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate3d(${x * 0.16}px, ${y * 0.22}px, 0)`;
        onMouseMove?.(event);
      }}
      onMouseLeave={(event) => {
        if (ref.current) ref.current.style.transform = "";
        onMouseLeave?.(event);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
