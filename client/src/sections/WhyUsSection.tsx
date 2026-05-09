import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { iconMap, fadeInUp, stagger } from "@/config/constants";
import { motion } from "framer-motion";

export function WhyUsSection() {
  const { t } = useLanguage();

  // Mapping for Bento Grid spanning logic
  // Item 0: Large (col-span-2, row-span-2 on large screens)
  // Item 1, 2, 3: Normal
  // Item 4: Wide (col-span-2)
  // Item 5: Normal
  const getBentoClasses = (index: number) => {
    switch(index) {
      case 0: return "md:col-span-2 md:row-span-2";
      case 1: return "md:col-span-1";
      case 2: return "md:col-span-1";
      case 3: return "md:col-span-1";
      case 4: return "md:col-span-2";
      case 5: return "md:col-span-1";
      default: return "md:col-span-1";
    }
  };

  return (
    <section id="why-us" className="py-20 lg:py-28 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="container relative">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="text-center mb-16">
          <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-serif font-bold mb-4">{t.whyUs.title}</motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto">{t.whyUs.subtitle}</motion.p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {t.whyUs.items.map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className={getBentoClasses(i)}>
              <Card className={`glass-card hover:border-primary/40 transition-all duration-300 group h-full ${i === 0 ? "bg-[var(--color-gold)]/5 border-[var(--color-gold)]/30 shadow-[0_0_20px_rgba(213,181,99,0.1)]" : ""}`}>
                <CardContent className={`p-6 md:p-8 flex flex-col ${i === 0 ? "justify-end min-h-[300px]" : "h-full justify-center"}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors ${i === 0 ? "bg-[var(--color-gold)]/20 text-[var(--color-gold)] w-16 h-16 shadow-[0_0_15px_rgba(213,181,99,0.2)]" : "bg-primary/10 text-primary group-hover:bg-primary/20"}`}>
                    {/* Scale up icon for the featured bento box */}
                    <div className={i === 0 ? "scale-150" : ""}>
                      {iconMap[item.icon]}
                    </div>
                  </div>
                  <h3 className={`font-serif font-semibold mb-3 text-foreground ${i === 0 ? "text-2xl" : "text-lg"}`}>{item.title}</h3>
                  <p className={`text-muted-foreground leading-relaxed ${i === 0 ? "text-base" : "text-sm"}`}>{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
