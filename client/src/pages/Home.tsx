import { lazy, Suspense } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

import { Navbar } from "@/sections/Navbar";
import { HeroSection } from "@/sections/HeroSection";
import { ServicesSection } from "@/sections/ServicesSection";
import { PriceTableSection } from "@/sections/PriceTableSection";
import { PickupStepsSection } from "@/sections/PickupStepsSection";
import { WhyUsSection } from "@/sections/WhyUsSection";
import { StatsSection } from "@/sections/StatsSection";
import { QuickBookingSection } from "@/sections/QuickBookingSection";
import { BookingSection } from "@/sections/BookingSection";
import { GallerySection } from "@/sections/GallerySection";
import { FAQSection } from "@/sections/FAQSection";
import { ContactSection } from "@/sections/ContactSection";
import { CtaSection } from "@/sections/CtaSection";
import { Footer } from "@/sections/Footer";
import { StickyMobileCta } from "@/sections/StickyMobileCta";

const ChatWidget = lazy(() =>
  import("@/components/ChatWidget").then((module) => ({ default: module.ChatWidget }))
);

export default function Home() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-background pb-20 text-foreground md:pb-0">
      <Navbar />
      <HeroSection />
      <QuickBookingSection />
      <PriceTableSection />
      <PickupStepsSection />
      <ServicesSection />
      <WhyUsSection />
      <StatsSection />
      <BookingSection />
      <GallerySection />
      <FAQSection />
      <ContactSection />
      <CtaSection />
      <Footer />

      {/* FAQ Chat Widget — offline, no backend needed */}
      <Suspense fallback={null}>
        <ChatWidget lang={lang} />
      </Suspense>
      <StickyMobileCta />
    </div>
  );
}
