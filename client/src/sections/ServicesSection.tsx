import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { iconMap, fadeInUp, stagger, scrollToSection } from "@/config/constants";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

export function ServicesSection() {
  const { t } = useLanguage();

  return (
    <section id="services" className="py-20 lg:py-28">
      <div className="container">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="text-center mb-16">
          <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-serif font-bold mb-4">{t.services.title}</motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto">{t.services.subtitle}</motion.p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.services.routes.map((route, i) => (
            <motion.div key={i} variants={fadeInUp} className="group">
              <div className="relative h-full rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all duration-500 hover:border-[var(--color-gold)]/40 hover:shadow-lg hover:shadow-[var(--color-gold)]/5 hover:-translate-y-1 overflow-hidden">
                {/* Gradient glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-gold)]/0 via-[var(--color-gold)]/0 to-[var(--color-gold)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-gold)]/10 to-transparent flex items-center justify-center text-[var(--color-gold)] mb-5 group-hover:from-[var(--color-gold)]/20 group-hover:to-[var(--color-gold)]/5 transition-all duration-300 group-hover:scale-110 border border-[var(--color-gold)]/20">
                    {iconMap[route.icon]}
                  </div>

                  {/* Route name */}
                  <h3 className="font-serif text-lg font-semibold mb-3 text-foreground">{route.name}</h3>

                  {/* Price — highlighted */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/30 mb-4">
                    <span className="text-[var(--color-gold)] font-bold text-xl drop-shadow-sm">{route.price}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{route.desc}</p>

                  {/* Features */}
                  <ul className="space-y-1.5 mb-5">
                    <li className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-[var(--color-gold)] shrink-0" />
                      <span>{t.hero.features[0]}</span>
                    </li>
                    <li className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-[var(--color-gold)] shrink-0" />
                      <span>{t.hero.features[1]}</span>
                    </li>
                  </ul>

                  {/* CTA */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[var(--color-gold)] hover:text-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 p-0 h-auto font-medium"
                    onClick={() => scrollToSection("booking")}
                  >
                    {t.nav.bookNow} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
