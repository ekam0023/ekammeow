import { useEffect } from "react";
import { Minus, Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  cartCount,
  cartSubtotal,
  useCart,
} from "@/lib/cart-store";
import { PRODUCTS } from "@/lib/products";
import { formatINR } from "@/lib/utils";
import { MagneticButton } from "@/components/meow/MagneticButton";
import { useLenis } from "@/components/meow/SmoothScroll";

export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const count = cartCount(items);
  const subtotal = cartSubtotal(items);
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    if (isOpen) lenis.stop();
    else lenis.start();
  }, [isOpen, lenis]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            className="meow-overlay fixed inset-0 z-overlay bg-cocoa-deep/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="meow-drawer fixed top-0 right-0 z-drawer flex h-dvh w-full max-w-md flex-col bg-cream text-cocoa"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-cocoa/10 px-6 py-5">
              <h2 id="cart-title" className="font-display text-2xl font-bold">
                Cart
                <span className="ml-2 text-caramel tabular-nums">({count})</span>
              </h2>
              <button
                type="button"
                onClick={close}
                className="inline-flex min-h-11 min-w-11 items-center justify-center"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <p className="max-w-xs text-sm leading-relaxed text-milk">
                  Empty. That is a personal problem we can help with.
                </p>
              ) : (
                <ul className="flex flex-col gap-6">
                  {items.map((item) => {
                    const product = PRODUCTS.find((p) => p.id === item.id);
                    if (!product) return null;
                    return (
                      <li key={item.id} className="flex gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-24 w-24 rounded-md object-cover"
                        />
                        <div className="flex min-w-0 flex-1 flex-col">
                          <p className="font-display text-lg font-semibold">
                            {product.name}
                          </p>
                          <p className="text-sm text-milk">
                            {formatINR(product.price)}
                          </p>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cocoa/15"
                                aria-label="Decrease quantity"
                                onClick={() =>
                                  setQuantity(item.id, item.quantity - 1)
                                }
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-4 text-center text-sm tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cocoa/15"
                                aria-label="Increase quantity"
                                onClick={() =>
                                  setQuantity(item.id, item.quantity + 1)
                                }
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button
                              type="button"
                              className="text-xs tracking-[0.16em] uppercase"
                              onClick={() => remove(item.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="border-t border-cocoa/10 px-6 py-5">
              <div className="mb-4 flex items-baseline justify-between">
                <span className="text-xs tracking-[0.2em] uppercase">
                  Subtotal
                </span>
                <span className="font-display text-2xl font-bold tabular-nums">
                  {formatINR(subtotal)}
                </span>
              </div>
              <MagneticButton
                className="w-full bg-cocoa text-cream hover:bg-milk"
                data-cursor="CLICK"
                disabled={items.length === 0}
                onClick={() => {
                  close();
                  useCart.setState({
                    toast: "Craving noted. Checkout comes later.",
                  });
                }}
              >
                Checkout
              </MagneticButton>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
