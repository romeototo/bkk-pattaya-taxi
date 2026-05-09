import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { fadeInUp, stagger } from "@/config/constants";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

export function ReviewsSection() {
  const { t } = useLanguage();
  const reviews = t.reviews.items;
  const [active, setActive] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % reviews.length);
  }, [reviews.length]);

  const prev = useCallback(() => {
    setActive((prev) => (prev - 1 + reviews.length) % reviews.length);
  }, [reviews.length]);

  // Auto-advance every 5s
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next]);

  // Pause auto-play on interaction
  const handleManualNav = (fn: () => void) => {
    setIsAutoPlaying(false);
    fn();
    // Resume after 10s of no interaction
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section id="reviews" className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
      <div className="container relative">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="text-center mb-16">
          <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-serif font-bold mb-4">{t.reviews.title}</motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto">{t.reviews.subtitle}</motion.p>
        </motion.div>

        {/* Featured Review — Big Card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-3xl mx-auto mb-8"
        >
          <Card className="glass-card border-primary/20 hover:border-[var(--color-gold)]/20 transition-colors relative overflow-hidden">
            <div className="absolute top-6 right-6 text-[var(--color-gold)]/10">
              <Quote className="w-20 h-20" />
            </div>
            <CardContent className="p-8 lg:p-12">
              {/* Stars */}
              <div className="flex items-center gap-1 mb-6">
                {Array.from({ length: reviews[active].rating }).map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-[var(--color-gold)] text-[var(--color-gold)] drop-shadow-[0_0_8px_rgba(213,181,99,0.5)]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-lg lg:text-xl text-foreground/90 leading-relaxed mb-8 italic font-light min-h-[4.5rem] transition-all">
                "{reviews[active].text}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-gold)]/20 to-transparent flex items-center justify-center text-[var(--color-gold)] font-semibold text-base border border-[var(--color-gold)]/30 shadow-[0_0_15px_rgba(213,181,99,0.1)]">
                    {reviews[active].name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{reviews[active].name}</p>
                    <p className="text-sm text-muted-foreground">{reviews[active].country}</p>
                  </div>
                </div>

                {/* Navigation arrows */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleManualNav(prev)}
                    className="w-10 h-10 rounded-full border border-border hover:border-[var(--color-gold)]/50 hover:bg-[var(--color-gold)]/10 flex items-center justify-center text-muted-foreground hover:text-[var(--color-gold)] transition-all hover:shadow-[0_0_10px_rgba(213,181,99,0.15)]"
                    aria-label="Previous review"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleManualNav(next)}
                    className="w-10 h-10 rounded-full border border-border hover:border-[var(--color-gold)]/50 hover:bg-[var(--color-gold)]/10 flex items-center justify-center text-muted-foreground hover:text-[var(--color-gold)] transition-all hover:shadow-[0_0_10px_rgba(213,181,99,0.15)]"
                    aria-label="Next review"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2">
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleManualNav(() => setActive(i))}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active
                  ? "w-8 bg-[var(--color-gold)] shadow-[0_0_8px_rgba(213,181,99,0.4)]"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
