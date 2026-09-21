import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "@/components/meow/Loader";
import { Grain } from "@/components/meow/Grain";
import { Cursor } from "@/components/meow/Cursor";
import { SmoothScroll } from "@/components/meow/SmoothScroll";
import { Navbar } from "@/components/meow/Navbar";
import { Hero } from "@/components/meow/Hero";
import { ChocolateReveal } from "@/components/meow/ChocolateReveal";
import { BarInspect } from "@/components/meow/BarInspect";
import { StorySection } from "@/components/meow/StorySection";
import { CocoaJourney } from "@/components/meow/CocoaJourney";
import { MeltTransition } from "@/components/meow/MeltTransition";
import { AbstractWorld } from "@/components/meow/AbstractWorld";
import { FlavorSection } from "@/components/meow/FlavorSection";
import { GiantType } from "@/components/meow/GiantType";
import { TheBite } from "@/components/meow/TheBite";
import { ShopSection } from "@/components/meow/ShopSection";
import { AboutMeow } from "@/components/meow/AboutMeow";
import { Testimonials } from "@/components/meow/Testimonials";
import { CTASection } from "@/components/meow/CTASection";
import { Footer } from "@/components/meow/Footer";
import { CartDrawer } from "@/components/meow/CartDrawer";
import { ProductModal } from "@/components/meow/ProductModal";
import { Toast } from "@/components/meow/Toast";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <>
      <a
        href="#story"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-cursor focus:bg-cream focus:px-4 focus:py-2 focus:text-cocoa"
      >
        Skip to story
      </a>
      <Loader />
      <Grain />
      <Cursor />
      <SmoothScroll>
        <Navbar />
        <main>
          <Hero />
          <ChocolateReveal />
          <BarInspect />
          <StorySection />
          <CocoaJourney />
          <MeltTransition />
          <AbstractWorld />
          <FlavorSection />
          <GiantType />
          <TheBite />
          <ShopSection />
          <AboutMeow />
          <Testimonials />
          <CTASection />
        </main>
        <Footer />
        <CartDrawer />
        <ProductModal />
        <Toast />
      </SmoothScroll>
    </>
  );
}
