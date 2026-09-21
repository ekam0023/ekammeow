import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart-store";

export function Toast() {
  const toast = useCart((s) => s.toast);
  const dismiss = useCart((s) => s.dismissToast);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(dismiss, 2400);
    return () => window.clearTimeout(id);
  }, [toast, dismiss]);

  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="meow-toast fixed bottom-6 left-1/2 z-toast -translate-x-1/2 rounded-full bg-cream px-5 py-3 text-sm text-cocoa shadow-lg"
        >
          {toast}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
