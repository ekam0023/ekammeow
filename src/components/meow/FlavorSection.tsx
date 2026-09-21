import { useEffect, useRef, useState } from "react";
import { getGsap } from "@/lib/gsap-client";
import { PRODUCTS } from "@/lib/products";
import { useCart } from "@/lib/cart-store";
import { prefersReducedMotion } from "@/lib/utils";
import { useScene } from "@/lib/scene-store";
import { cn } from "@/lib/utils";

export function FlavorSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const openProduct = useCart((s) => s.openProduct);
  const ready = useScene((s) => s.ready);
  const product = PRODUCTS[active] ?? PRODUCTS[0];

  useEffect(() => {
    if (!ready) return;
    const pin = pinRef.current;
    if (!pin || prefersReducedMotion()) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;
    const { ScrollTrigger } = getGsap();

    const trigger = ScrollTrigger.create({
      trigger: pin,
      start: "top top",
      end: "+=280%",
      pin: true,
      scrub: 0.65,
      onUpdate: (self) => {
        const index = Math.min(
          PRODUCTS.length - 1,
          Math.floor(self.progress * 0.999 * PRODUCTS.length),
        );
        setActive(index);
      },
    });

    return () => trigger.kill();
  }, [ready]);

  return (
    <section
      id="flavors"
      ref={sectionRef}
      className="relative bg-cocoa-deep"
      aria-labelledby="flavors-title"
    >
      <div className="px-6 pt-24 md:px-16 md:pt-32">
        <p className="text-[11px] tracking-[0.3em] text-caramel uppercase">
          The lineup
        </p>
        <h2
          id="flavors-title"
          className="font-display mt-4 text-5xl font-bold md:text-7xl"
        >
          MEET THE FLAVORS
        </h2>
      </div>

      <div ref={pinRef} className="relative hidden h-dvh md:block">
        <article
          className="relative flex h-full items-center overflow-hidden"
          data-cursor="EXPLORE"
        >
          <img
            key={product.id}
            src={product.image}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-linear-to-r from-cocoa-deep via-cocoa-deep/70 to-transparent" />
          <div className="relative z-10 max-w-xl px-16">
            <p className="text-[11px] tracking-[0.28em] text-caramel uppercase">
              {product.cocoa} cocoa · {product.tagline}
            </p>
            <h3 className="font-display mt-5 text-6xl font-bold lg:text-8xl">
              {product.shortName}
            </h3>
            <p className="mt-6 max-w-sm text-cream-dim">{product.description}</p>
            <button
              type="button"
              className="mt-8 min-h-12 text-xs tracking-[0.24em] uppercase"
              onClick={() => openProduct(product.id)}
              data-cursor="CLICK"
            >
              Explore {product.shortName} →
            </button>
          </div>
          <ol className="absolute right-12 bottom-12 flex flex-col gap-3">
            {PRODUCTS.map((item, i) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "text-left text-xs tracking-[0.2em] uppercase transition-opacity duration-200",
                    i === active ? "text-cream opacity-100" : "text-cream/40",
                  )}
                >
                  0{i + 1} {item.shortName}
                </button>
              </li>
            ))}
          </ol>
        </article>
      </div>

      <div className="flex flex-col md:hidden">
        {PRODUCTS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="relative min-h-[70vh] overflow-hidden text-left"
            onClick={() => openProduct(item.id)}
          >
            <img
              src={item.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-cocoa-deep/45" />
            <div className="relative z-10 flex h-full min-h-[70vh] flex-col justify-end p-6 pb-10">
              <p className="text-[11px] tracking-[0.22em] text-caramel uppercase">
                {item.tagline}
              </p>
              <h3 className="font-display mt-2 text-5xl font-bold">
                {item.shortName}
              </h3>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
