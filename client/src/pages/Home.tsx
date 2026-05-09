import { lazy, Suspense, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { WHATSAPP_URL } from "@/config/constants";
import { MessageCircle } from "lucide-react";

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

const hasBackend = Boolean(import.meta.env.VITE_TRPC_URL);

export default function Home() {
  const { lang } = useLanguage();
  const [isChatRequested, setIsChatRequested] = useState(false);

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

      {/* AI Chat Widget — only show when backend is configured */}
      {hasBackend && (
        isChatRequested ? (
          <Suspense fallback={null}>
            <ChatWidget lang={lang} defaultOpen />
          </Suspense>
        ) : (
          <button
            type="button"
            onClick={() => setIsChatRequested(true)}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center shadow-lg shadow-primary/25 transition-all hover:scale-110"
            aria-label="Open booking chat"
          >
            <MessageCircle className="w-6 h-6 text-primary-foreground" />
          </button>
        )
      )}

      {/* Floating WhatsApp Button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed ${hasBackend ? "bottom-24" : "bottom-6"} right-6 z-50 w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25 transition-all hover:scale-110`}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </a>
    </div>
  );
}
