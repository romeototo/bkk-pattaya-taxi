import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { WHATSAPP_URL, scrollToSection } from "@/config/constants";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";

export function CtaSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 relative overflow-hidden border-t border-border/70 bg-secondary/15">
      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl rounded-lg border border-[var(--color-gold)]/25 bg-background/70 p-8 shadow-xl shadow-background/30 md:p-14">
          <div className="text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-serif font-bold mb-6 text-foreground"
            >
              {t.cta.title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              {t.cta.subtitle}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                size="lg"
                onClick={() => scrollToSection("booking")}
                className="bg-[var(--color-gold)] text-background hover:bg-[oklch(0.86_0.12_85)] text-base px-8 py-6 w-full sm:w-auto shadow-lg shadow-[var(--color-gold)]/15 group"
              >
                {t.hero.bookNow}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.open(WHATSAPP_URL, "_blank")}
                className="text-base px-8 py-6 w-full sm:w-auto border-primary/30 text-primary hover:bg-primary/10"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {t.hero.whatsapp}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
