import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { WHATSAPP_URL, scrollToSection } from "@/config/constants";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";

export function CtaSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background with glowing effect */}
      <div className="absolute inset-0 bg-primary/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto glass-card rounded-3xl p-8 md:p-16 border border-primary/20 shadow-2xl overflow-hidden relative">
          
          {/* Inner glowing orb */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/30 blur-[60px] rounded-full pointer-events-none" />

          <div className="relative z-10 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-serif font-bold mb-6 text-foreground"
            >
              Ready for a Seamless Transfer?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              Book your private taxi from Bangkok to Pattaya today. Fixed prices, no hidden fees, and professional English-speaking drivers.
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
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6 w-full sm:w-auto shadow-lg shadow-primary/25 group"
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
