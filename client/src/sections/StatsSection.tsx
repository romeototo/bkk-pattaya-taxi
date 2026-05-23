import { useLanguage } from "@/contexts/LanguageContext";
import { fadeInUp, stagger } from "@/config/constants";
import { motion } from "framer-motion";
import { Car, CreditCard, Clock, Plane } from "lucide-react";
import { PRICING, formatPrice } from "@/config/pricing";

function StatValue({ value, suffix = "" }: { value: number; suffix?: string }) {
  return <span className="tabular-nums">{value.toLocaleString()}{suffix}</span>;
}

const stats = {
  en: [
    { icon: <CreditCard className="w-5 h-5" />, value: formatPrice(PRICING.bkkToPattaya), label: "Bangkok to Pattaya" },
    { icon: <Plane className="w-5 h-5" />, value: "BKK + DMK", label: "Airport pickup" },
    { icon: <Clock className="w-5 h-5" />, value: "24/7", label: "Pickup times" },
    { icon: <Car className="w-5 h-5" />, value: "Private", label: "No shared ride" },
  ],
  th: [
    { icon: <CreditCard className="w-5 h-5" />, value: formatPrice(PRICING.bkkToPattaya), label: "กรุงเทพ ไป พัทยา" },
    { icon: <Plane className="w-5 h-5" />, value: "BKK + DMK", label: "รับที่สนามบิน" },
    { icon: <Clock className="w-5 h-5" />, value: "24/7", label: "เวลารับรถ" },
    { icon: <Car className="w-5 h-5" />, value: "Private", label: "รถส่วนตัว" },
  ],
};

export function StatsSection() {
  const { lang } = useLanguage();
  const currentStats = stats[lang];

  return (
    <section className="py-12 lg:py-16 relative overflow-hidden border-y border-border/60 bg-secondary/20">
      <div className="container relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {currentStats.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="text-center group"
            >
              <div className="rounded-lg border border-border/70 bg-background/35 p-5 lg:p-7 transition-all duration-300 hover:border-[var(--color-gold)]/40 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="w-11 h-11 rounded-md bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 flex items-center justify-center text-[var(--color-gold)] mx-auto mb-4 transition-all group-hover:bg-[var(--color-gold)]/16">
                    {stat.icon}
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-[var(--color-gold)] mb-1">
                    {typeof stat.value === "number" ? <StatValue value={stat.value} /> : <span>{stat.value}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
