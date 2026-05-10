import { lazy, Suspense } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

import { Navbar } from "@/sections/Navbar";
import { HeroSection } from "@/sections/HeroSection";
import { ServicesSection } from "@/sections/ServicesSection";
import { WhyUsSection } from "@/sections/WhyUsSection";
import { StatsSection } from "@/sections/StatsSection";
import { ReviewsSection } from "@/sections/ReviewsSection";
import { BookingSection } from "@/sections/BookingSection";
import { GallerySection } from "@/sections/GallerySection";
import { FAQSection } from "@/sections/FAQSection";
import { ContactSection } from "@/sections/ContactSection";
import { CtaSection } from "@/sections/CtaSection";
import { Footer } from "@/sections/Footer";

const ChatWidget = lazy(() =>
  import("@/components/ChatWidget").then((module) => ({ default: module.ChatWidget }))
);

export default function Home() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <WhyUsSection />
      <StatsSection />
      <ReviewsSection />
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
    </div>
  );
}
