import { useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart-store";
import { PRODUCTS } from "@/lib/products";
import { formatINR } from "@/lib/utils";
import { MagneticButton } from "@/components/meow/MagneticButton";
import { WebGLFrame } from "@/components/meow/WebGLFrame";

const loadViewer = () => import("@/components/three/ViewerCanvas");

export function ProductModal() {
  const viewing = useCart((s) => s.viewing);
  const close = useCart((s) => s.closeProduct);
  const add = useCart((s) => s.add);
  const product = PRODUCTS.find((p) => p.id === viewing);

  useEffect(() => {
    if (!viewing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewing, close]);

  return (
    <AnimatePresence>
      {product ? (
        <motion.div
          className="meow-drawer fixed inset-0 z-drawer flex items-end justify-center bg-cocoa-deep/70 p-4 md:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-title"
            className="grid w-full max-w-3xl overflow-hidden rounded-xl bg-cocoa md:grid-cols-2"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 w-full md:h-full md:min-h-[22rem]">
              <WebGLFrame
                importer={loadViewer}
                className="absolute inset-0"
                fallback={
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                }
              />
              <p className="pointer-events-none absolute bottom-3 left-0 w-full text-center text-[10px] tracking-[0.22em] text-cream/70 uppercase">
                Drag to spin
              </p>
            </div>
            <div className="relative flex flex-col p-6 md:p-8">
              <button
                type="button"
                onClick={close}
                className="absolute top-4 right-4 inline-flex min-h-11 min-w-11 items-center justify-center"
                aria-label="Close product"
              >
                <X size={18} />
              </button>
              <p className="text-[11px] tracking-[0.24em] text-caramel uppercase">
                {product.cocoa} cocoa
              </p>
              <h2
                id="product-title"
                className="font-display mt-3 text-4xl font-bold"
              >
                {product.name}
              </h2>
              <p className="mt-2 text-cream-dim">{product.tagline}</p>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/80">
                {product.description}
              </p>
              <p className="font-display mt-8 text-3xl font-semibold tabular-nums">
                {formatINR(product.price)}
              </p>
              <MagneticButton
                className="mt-6 self-start"
                data-cursor="CLICK"
                onClick={() => {
                  add(product.id);
                  close();
                }}
              >
                Add to cart
              </MagneticButton>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
