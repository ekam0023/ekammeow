import { Instagram, Music2 } from "lucide-react";
import { useLenis } from "@/components/meow/SmoothScroll";

const LINKS = [
  { href: "#shop", label: "SHOP" },
  { href: "#story", label: "STORY" },
  { href: "#flavors", label: "FLAVORS" },
  { href: "#about", label: "ABOUT" },
  { href: "mailto:hello@meowchocolate.com", label: "CONTACT" },
] as const;

export function Footer() {
  const lenis = useLenis();

  const go = (href: string) => {
    if (href.startsWith("mailto:")) return;
    const el = document.querySelector(href);
    if (!el) return;
    if (lenis) lenis.scrollTo(el as HTMLElement);
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-cream/10 bg-cocoa-deep px-6 py-12 md:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-4xl font-extrabold tracking-[-0.05em]">
            MEOW™
          </p>
          <p className="mt-3 text-sm tracking-[0.18em] text-cream-dim uppercase">
            Chocolate for the curious.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-3" aria-label="Footer">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[11px] tracking-[0.22em] text-cream/70 uppercase hover:text-cream"
              data-cursor="CLICK"
              onClick={(e) => {
                if (link.href.startsWith("mailto:")) return;
                e.preventDefault();
                go(link.href);
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl items-center justify-between border-t border-cream/10 pt-6">
        <p className="text-xs text-cream/40">© {new Date().getFullYear()} MEOW Chocolate</p>
        <div className="flex gap-3">
          <a
            href="https://instagram.com"
            className="inline-flex min-h-11 min-w-11 items-center justify-center text-cream/70 hover:text-cream"
            aria-label="Instagram"
            target="_blank"
            rel="noreferrer"
          >
            <Instagram size={16} />
          </a>
          <a
            href="https://tiktok.com"
            className="inline-flex min-h-11 min-w-11 items-center justify-center text-cream/70 hover:text-cream"
            aria-label="TikTok"
            target="_blank"
            rel="noreferrer"
          >
            <Music2 size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
