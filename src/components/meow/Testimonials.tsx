const QUOTES = [
  "Ridiculously good.",
  "Dangerously easy to finish.",
  "My new desk drawer essential.",
  "Chocolate, but make it unforgettable.",
  "Small bar. Big mood.",
];

export function Testimonials() {
  const loop = [...QUOTES, ...QUOTES];

  return (
    <section
      className="overflow-hidden border-y border-cream/10 bg-cocoa py-14 md:py-20"
      aria-label="What people say"
    >
      <p className="mb-8 px-6 text-center text-[11px] tracking-[0.3em] text-caramel uppercase">
        Overheard
      </p>
      <div className="flex overflow-hidden">
        <div className="marquee-track flex min-w-max gap-16 pr-16">
          {loop.map((quote, i) => (
            <p
              key={`${quote}-${i}`}
              className="font-display text-4xl font-semibold tracking-tight text-cream italic md:text-6xl"
            >
              {quote}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
