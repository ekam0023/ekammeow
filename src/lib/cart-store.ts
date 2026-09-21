import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductId } from "@/lib/products";
import { PRODUCTS } from "@/lib/products";

export interface CartItem {
  id: ProductId
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  viewing: ProductId | null
  toast: string | null
  open: () => void
  close: () => void
  toggle: () => void
  add: (id: ProductId) => void
  remove: (id: ProductId) => void
  setQuantity: (id: ProductId, quantity: number) => void
  clear: () => void
  openProduct: (id: ProductId) => void
  closeProduct: () => void
  dismissToast: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      viewing: null,
      toast: null,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set({ isOpen: !get().isOpen }),
      add: (id) => {
        const existing = get().items.find((item) => item.id === id);
        const name = PRODUCTS.find((p) => p.id === id)?.name ?? "MEOW";
        const items = existing
          ? get().items.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
            )
          : [...get().items, { id, quantity: 1 }];
        set({ items, toast: `${name} added.` });
      },
      remove: (id) =>
        set({ items: get().items.filter((item) => item.id !== id) }),
      setQuantity: (id, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((item) => item.id !== id) });
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item,
          ),
        });
      },
      clear: () => set({ items: [] }),
      openProduct: (id) => set({ viewing: id }),
      closeProduct: () => set({ viewing: null }),
      dismissToast: () => set({ toast: null }),
    }),
    {
      name: "meow-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
}
