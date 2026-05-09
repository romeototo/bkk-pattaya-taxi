import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { iconMap, fadeInUp, stagger } from "@/config/constants";
import { motion } from "framer-motion";
import { Car, ShieldCheck, Clock, CheckCircle2, Plane, MessageCircle } from "lucide-react";

export function WhyUsSection() {
  const { t } = useLanguage();

  // Custom Bento Layout & Styling for each card
  const getBentoProps = (index: number) => {
    switch (index) {
      case 0: // Fixed Price Guarantee
        return {
          wrapperClass: "md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2",
          cardClass: "bg-[var(--color-gold)]/5 border-[var(--color-gold)]/30 shadow-[0_0_30px_rgba(213,181,99,0.15)] overflow-hidden relative group",
          contentClass: "justify-end min-h-[300px] lg:min-h-[400px]",
          iconWrapClass: "bg-[var(--color-gold)]/20 text-[var(--color-gold)] w-16 h-16 shadow-[0_0_15px_rgba(213,181,99,0.2)]",
          iconScale: "scale-150",
          titleClass: "text-2xl lg:text-3xl gradient-gold-text drop-shadow-sm",
          descClass: "text-base lg:text-lg text-muted-foreground max-w-sm relative z-10",
          watermark: <ShieldCheck className="absolute -right-10 -bottom-10 w-64 h-64 text-[var(--color-gold)]/5 -rotate-12 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6" />
        };
      case 1: // Professional Drivers
        return {
          wrapperClass: "md:col-span-2 lg:col-span-2",
          cardClass: "bg-gradient-to-br from-primary/10 to-transparent border-primary/20 hover:border-primary/50 relative overflow-hidden group",
          contentClass: "justify-center h-full",
          iconWrapClass: "bg-primary/20 text-primary w-12 h-12 group-hover:scale-110 transition-transform",
          iconScale: "",
          titleClass: "text-xl",
          descClass: "text-sm",
          watermark: <Car className="absolute -right-4 -bottom-4 w-32 h-32 text-primary/5 transition-transform duration-700 group-hover:translate-x-2" />
        };
      case 2: // 24/7 Service
        return {
          wrapperClass: "md:col-span-1 lg:col-span-1",
          cardClass: "glass-card hover:border-primary/40 group",
          contentClass: "justify-center h-full",
          iconWrapClass: "bg-primary/10 text-primary w-12 h-12 group-hover:bg-primary/20",
          iconScale: "",
          titleClass: "text-lg",
          descClass: "text-sm",
          watermark: null
        };
      case 3: // Private Transfer Only
        return {
          wrapperClass: "md:col-span-1 lg:col-span-1",
          cardClass: "glass-card hover:border-primary/40 group",
          contentClass: "justify-center h-full",
          iconWrapClass: "bg-primary/10 text-primary w-12 h-12 group-hover:bg-primary/20",
          iconScale: "",
          titleClass: "text-lg",
          descClass: "text-sm",
          watermark: null
        };
      case 4: // Airport Meet & Greet
        return {
          wrapperClass: "md:col-span-1 lg:col-span-2",
          cardClass: "bg-gradient-to-tr from-blue-500/5 to-transparent border-blue-500/20 hover:border-blue-500/40 relative overflow-hidden group",
          contentClass: "justify-center h-full",
          iconWrapClass: "bg-blue-500/20 text-blue-400 w-12 h-12 group-hover:-translate-y-1 transition-transform",
          iconScale: "",
          titleClass: "text-xl",
          descClass: "text-sm",
          watermark: <Plane className="absolute -right-2 top-4 w-24 h-24 text-blue-500/5 -rotate-45 transition-transform duration-700 group-hover:translate-x-2 group-hover:-translate-y-2" />
        };
      case 5: // Easy Booking
        return {
          wrapperClass: "md:col-span-1 lg:col-span-2",
          cardClass: "bg-gradient-to-tl from-[#25D366]/10 to-transparent border-[#25D366]/20 hover:border-[#25D366]/40 relative overflow-hidden group",
          contentClass: "justify-center h-full",
          iconWrapClass: "bg-[#25D366]/20 text-[#25D366] w-12 h-12 group-hover:scale-110 transition-transform",
          iconScale: "",
          titleClass: "text-xl",
          descClass: "text-sm",
          watermark: <MessageCircle className="absolute -right-4 -bottom-4 w-32 h-32 text-[#25D366]/5 transition-transform duration-700 group-hover:scale-110" />
        };
      default:
        return {
          wrapperClass: "md:col-span-1",
          cardClass: "glass-card",
          contentClass: "justify-center h-full",
          iconWrapClass: "bg-primary/10 text-primary w-12 h-12",
          iconScale: "",
          titleClass: "text-lg",
          descClass: "text-sm",
          watermark: null
        };
    }
  };

  return (
    <section id="why-us" className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Decorative Orbs */}
      <div className="absolute left-0 top-1/3 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute right-0 bottom-1/3 w-64 h-64 bg-[var(--color-gold)]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="text-center mb-16">
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-4">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Why Choose Us</span>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl lg:text-5xl font-serif font-bold mb-6 drop-shadow-sm">{t.whyUs.title}</motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">{t.whyUs.subtitle}</motion.p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {t.whyUs.items.map((item, i) => {
            const props = getBentoProps(i);
            return (
              <motion.div key={i} variants={fadeInUp} className={props.wrapperClass}>
                <Card className={`h-full transition-all duration-500 ${props.cardClass}`}>
                  <CardContent className={`p-6 md:p-8 flex flex-col relative z-10 ${props.contentClass}`}>
                    <div className={`rounded-2xl flex items-center justify-center mb-6 shrink-0 ${props.iconWrapClass}`}>
                      <div className={props.iconScale}>
                        {iconMap[item.icon]}
                      </div>
                    </div>
                    <h3 className={`font-serif font-semibold mb-3 tracking-tight text-foreground ${props.titleClass}`}>{item.title}</h3>
                    <p className={`leading-relaxed opacity-90 ${props.descClass}`}>{item.desc}</p>
                  </CardContent>
                  {props.watermark}
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
