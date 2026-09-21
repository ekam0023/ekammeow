import { PRODUCTS } from "@/lib/products";
import { useCart } from "@/lib/cart-store";
import { formatINR } from "@/lib/utils";
import { MagneticButton } from "@/components/meow/MagneticButton";

export function ShopSection() {
  const add = useCart((s) => s.add);
  const openProduct = useCart((s) => s.openProduct);

  return (
    <section
      id="shop"
      className="relative bg-cream px-6 py-24 text-cocoa md:px-16 md:py-32"
      aria-labelledby="shop-title"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] tracking-[0.3em] text-milk uppercase">
          Take some home
        </p>
        <h2
          id="shop-title"
          className="font-display mt-4 text-5xl font-bold md:text-7xl"
        >
          TAKE SOME HOME.
        </h2>
        <p className="mt-5 max-w-md text-milk">
          Small bar. Big mood. Four ways to misbehave.
        </p>

        <ul className="mt-16 divide-y divide-cocoa/10 border-t border-cocoa/10">
          {PRODUCTS.map((product, index) => (
            <li
              key={product.id}
              className="grid items-center gap-6 py-10 md:grid-cols-[1.1fr_1fr]"
            >
              <button
                type="button"
                className="overflow-hidden rounded-lg text-left"
                onClick={() => openProduct(product.id)}
                data-cursor="EXPLORE"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out hover:scale-[1.04]"
                />
              </button>
              <div className={index % 2 === 1 ? "md:order-first" : ""}>
                <p className="text-[11px] tracking-[0.24em] text-milk uppercase">
                  {product.tagline} · {product.cocoa}
                </p>
                <h3 className="font-display mt-3 text-4xl font-bold md:text-5xl">
                  {product.name}
                </h3>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-milk">
                  {product.description}
                </p>
                <p className="font-display mt-6 text-3xl font-semibold tabular-nums">
                  {formatINR(product.price)}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <MagneticButton
                    data-cursor="CLICK"
                    className="bg-cocoa text-cream"
                    onClick={() => add(product.id)}
                  >
                    Add to cart
                  </MagneticButton>
                  <button
                    type="button"
                    className="min-h-12 px-5 text-xs tracking-[0.2em] uppercase"
                    data-cursor="CLICK"
                    onClick={() => openProduct(product.id)}
                  >
                    Quick view
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
