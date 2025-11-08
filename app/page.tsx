import { Header } from "@/components/header";
import { HeroSection } from "@/components/landing/hero-section";
import { BentoGrid } from "@/components/landing/bento-grid";
import PricingSection from "@/components/landing/pricing-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <BentoGrid />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
