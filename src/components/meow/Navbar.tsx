import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useCart, cartCount } from "@/lib/cart-store";
import { useLenis } from "@/components/meow/SmoothScroll";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#the-bar", label: "THE BAR" },
  { href: "#story", label: "STORY" },
  { href: "#flavors", label: "FLAVORS" },
  { href: "#shop", label: "SHOP" },
  { href: "#about", label: "ABOUT" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.open);
  const count = cartCount(items);
  const lenis = useLenis();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (!el) return;
    if (lenis) lenis.scrollTo(el as HTMLElement, { offset: 0 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={cn(
        "meow-nav fixed top-0 right-0 left-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300",
        scrolled || open ? "nav-glass" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
        <a
          href="#top"
          className="font-display text-lg font-extrabold tracking-[0.18em] text-cream md:text-xl"
          data-cursor="CLICK"
          onClick={(e) => {
            e.preventDefault();
            go("#top");
          }}
        >
          MEOW™
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-cursor="CLICK"
              className="text-[11px] font-semibold tracking-[0.22em] text-cream/80 transition-colors duration-150 hover:text-cream"
              onClick={(e) => {
                e.preventDefault();
                go(link.href);
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            data-cursor="CLICK"
            onClick={openCart}
            className="relative min-h-11 px-2 text-[11px] font-semibold tracking-[0.22em] text-cream"
            aria-label={`Open cart, ${count} items`}
          >
            CART
            <span className="ml-1 tabular-nums text-caramel">
              {mounted ? count : 0}
            </span>
          </button>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          className="flex min-h-[calc(100dvh-4rem)] flex-col gap-2 bg-cocoa-deep px-6 pt-8 pb-16 md:hidden"
          aria-label="Mobile"
        >
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-display py-3 text-4xl font-bold tracking-tight text-cream"
              onClick={(e) => {
                e.preventDefault();
                go(link.href);
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
