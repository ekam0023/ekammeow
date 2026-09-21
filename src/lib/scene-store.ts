import { create } from "zustand";

interface SceneState {
  hero: number
  abstract: number
  flavor: number
  bite: number
  cta: number
  ready: boolean
  setHero: (value: number) => void
  setAbstract: (value: number) => void
  setFlavor: (value: number) => void
  setBite: (value: number) => void
  setCta: (value: number) => void
  setReady: (value: boolean) => void
}

export const useScene = create<SceneState>((set) => ({
  hero: 0,
  abstract: 0,
  flavor: 0,
  bite: 0,
  cta: 0,
  ready: false,
  setHero: (hero) => set({ hero }),
  setAbstract: (abstract) => set({ abstract }),
  setFlavor: (flavor) => set({ flavor }),
  setBite: (bite) => set({ bite }),
  setCta: (cta) => set({ cta }),
  setReady: (ready) => set({ ready }),
}));
