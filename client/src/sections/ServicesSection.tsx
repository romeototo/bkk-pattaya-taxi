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

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {t.services.routes.map((route, i) => (
            <motion.div key={i} variants={fadeInUp} className="group">
              <div className="relative h-full rounded-lg border border-border/70 bg-card/75 p-6 transition-all duration-300 hover:border-[var(--color-gold)]/45 hover:-translate-y-0.5 overflow-hidden">
                <div className="relative">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-md bg-[var(--color-gold)]/10 flex items-center justify-center text-[var(--color-gold)] mb-5 border border-[var(--color-gold)]/20">
                    {iconMap[route.icon]}
                  </div>

                  {/* Route name */}
                  <h3 className="font-serif text-lg font-semibold mb-3 text-foreground">{route.name}</h3>

                  {/* Price — highlighted */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/30 mb-4">
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
