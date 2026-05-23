import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { IMAGES, WHATSAPP_URL, fadeInUp, stagger, scrollToSection } from "@/config/constants";
import { motion } from "framer-motion";
import { Car, MessageCircle, ArrowRight, CheckCircle, ShieldCheck, Clock, MapPin } from "lucide-react";

export function HeroSection() {
  const { t, lang } = useLanguage();

  const trustProofs = [
    {
      value: "BKK",
      label: lang === "th" ? "รับสุวรรณภูมิ" : "Suvarnabhumi pickup",
    },
    {
      value: "24/7",
      label: lang === "th" ? "รับสนามบินได้ทุกเวลา" : "airport pickup",
    },
    {
      value: "DMK",
      label: lang === "th" ? "รับดอนเมือง" : "Don Mueang pickup",
    },
  ];

  return (
    <section className="relative min-h-[92vh] flex items-center pt-20 pb-10 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={IMAGES.hero}
          alt="Premium taxi service Bangkok to Pattaya"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,oklch(0.11_0.01_260/.98)_0%,oklch(0.11_0.01_260/.86)_42%,oklch(0.11_0.01_260/.42)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container relative z-10 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.7fr)] items-end">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl">
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-md border border-[var(--color-gold)]/35 bg-background/70 px-3 py-2 mb-6">
            <Car className="w-4 h-4 text-[var(--color-gold)]" />
            <span className="text-sm text-[var(--color-gold)] font-medium">{t.hero.badge}</span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-5 max-w-[13ch]">
            {t.hero.h1}
            <span className="block mt-2 text-[var(--color-gold)]">{t.hero.h1span}</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-lg text-foreground/78 mb-8 max-w-2xl leading-relaxed">
            {t.hero.subtitle}
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-wrap gap-3 mb-9">
            <Button
              size="lg"
              onClick={() => scrollToSection("booking")}
              className="bg-[var(--color-gold)] text-background font-bold text-base px-8 py-6 shadow-lg shadow-[var(--color-gold)]/15 hover:bg-[oklch(0.86_0.12_85)] group border-0 transition-all hover:-translate-y-0.5"
            >
              {t.hero.bookNow}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              onClick={() => window.open(WHATSAPP_URL, "_blank")}
              className="bg-whatsapp hover:opacity-90 text-white text-base px-8 py-6 shadow-lg shadow-green-500/20 group border-0"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              {t.hero.whatsapp}
            </Button>
          </motion.div>

          <motion.div variants={fadeInUp} className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-3 max-w-2xl">
            {t.hero.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground/75 font-medium">{feature}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          className="hidden lg:block"
        >
          <div className="rounded-lg border border-[var(--color-gold)]/25 bg-background/88 p-6 shadow-2xl shadow-background/40">
            <div className="flex items-start gap-3 border-b border-border/70 pb-5">
              <ShieldCheck className="mt-1 h-5 w-5 text-[var(--color-gold)]" />
              <div>
                <p className="text-sm font-semibold text-foreground">{t.hero.trustRating}</p>
                <p className="mt-1 text-sm leading-relaxed text-foreground/65">{t.hero.trustQuote}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 py-5">
              {trustProofs.map((item) => (
                <div key={item.value}>
                  <div className="font-serif text-2xl font-semibold text-[var(--color-gold)]">{item.value}</div>
                  <div className="mt-1 text-xs uppercase text-foreground/55">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="grid gap-3 border-t border-border/70 pt-5 text-sm text-foreground/70">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Bangkok, BKK, DMK, Pattaya, Jomtien</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>Typical trip time: 1.5-2 hours via Motorway 7</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
