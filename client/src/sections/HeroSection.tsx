import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { IMAGES, WHATSAPP_URL, fadeInUp, stagger, scrollToSection } from "@/config/constants";
import { motion } from "framer-motion";
import { Car, MessageCircle, ArrowRight, CheckCircle, Star } from "lucide-react";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={IMAGES.hero}
          alt="Premium taxi service Bangkok to Pattaya"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="container relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-2xl">
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-gold)]/50 bg-[var(--color-gold)]/10 mb-6 backdrop-blur-sm shadow-[0_0_15px_rgba(213,181,99,0.15)]">
            <Car className="w-4 h-4 text-[var(--color-gold)]" />
            <span className="text-sm text-[var(--color-gold)] font-medium">{t.hero.badge}</span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-4 drop-shadow-md">
            {t.hero.h1}
            <span className="block gradient-text mt-2">{t.hero.h1span}</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed drop-shadow-sm">
            {t.hero.subtitle}
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 mb-10">
            <Button
              size="lg"
              onClick={() => scrollToSection("booking")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6 shadow-xl shadow-primary/30 group"
            >
              {t.hero.bookNow}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              onClick={() => window.open(WHATSAPP_URL, "_blank")}
              className="bg-whatsapp hover:opacity-90 text-white text-base px-8 py-6 shadow-xl shadow-green-500/30 group border-0"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              {t.hero.whatsapp}
            </Button>
          </motion.div>

          <motion.div variants={fadeInUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {t.hero.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground font-medium drop-shadow-sm">{feature}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating Trust Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          className="hidden lg:block relative"
        >
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="glass-card p-6 rounded-2xl border border-primary/20 shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="flex -space-x-2">
                <img src="https://i.pravatar.cc/100?img=1" alt="User" className="w-10 h-10 rounded-full border-2 border-background" />
                <img src="https://i.pravatar.cc/100?img=2" alt="User" className="w-10 h-10 rounded-full border-2 border-background" />
                <img src="https://i.pravatar.cc/100?img=3" alt="User" className="w-10 h-10 rounded-full border-2 border-background" />
              </div>
              <div>
                <div className="flex text-[var(--color-gold)] drop-shadow-[0_0_5px_rgba(213,181,99,0.5)]">
                  <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                </div>
                <div className="text-sm font-bold text-foreground">4.9/5 Premium Rating</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic max-w-[200px]">"The best transfer experience in Thailand. Highly recommended!"</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
