import { WebGLFrame } from "@/components/meow/WebGLFrame";

const loadInspect = () => import("@/components/three/InspectCanvas");

function InspectFallback() {
  return (
    <img
      src="/images/hero-bar.jpg"
      alt="MEOW snack bar"
      className="h-full w-full object-cover"
    />
  );
}

export function BarInspect() {
  return (
    <section
      id="the-bar"
      className="relative bg-cocoa-deep px-6 py-20 md:px-12 md:py-28"
      aria-labelledby="inspect-title"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
        <div
          className="relative aspect-[4/5] overflow-hidden rounded-xl md:aspect-[5/4]"
          data-cursor="DRAG"
        >
          <WebGLFrame
            importer={loadInspect}
            className="absolute inset-0"
            fallback={<InspectFallback />}
          />
        </div>
        <div>
          <p className="text-[11px] tracking-[0.3em] text-caramel uppercase">
            The bar
          </p>
          <h2
            id="inspect-title"
            className="font-display mt-4 text-4xl leading-[0.95] font-bold md:text-6xl"
          >
            Hold it.
            <br />
            Spin it.
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-cream-dim">
            The real snack bar, in three dimensions. Drag to turn it over.
            Wrapper, foil, the lot — no fake geometry.
          </p>
          <p className="mt-8 text-[11px] tracking-[0.22em] text-cream/55 uppercase">
            Drag · auto-spins when you let go
          </p>
        </div>
      </div>
    </section>
  );
}
