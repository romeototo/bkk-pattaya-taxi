import { useLanguage } from "@/contexts/LanguageContext";
import { fadeInUp, stagger } from "@/config/constants";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Car, Star, Clock, Users } from "lucide-react";

function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

const stats = {
  en: [
    { icon: <Car className="w-5 h-5" />, value: 5000, suffix: "+", label: "Trips Completed" },
    { icon: <Star className="w-5 h-5" />, value: 4.9, suffix: "", label: "Average Rating", isDecimal: true },
    { icon: <Clock className="w-5 h-5" />, value: 24, suffix: "/7", label: "Service Available" },
    { icon: <Users className="w-5 h-5" />, value: 3200, suffix: "+", label: "Happy Customers" },
  ],
  th: [
    { icon: <Car className="w-5 h-5" />, value: 5000, suffix: "+", label: "เที่ยวที่ให้บริการ" },
    { icon: <Star className="w-5 h-5" />, value: 4.9, suffix: "", label: "คะแนนเฉลี่ย", isDecimal: true },
    { icon: <Clock className="w-5 h-5" />, value: 24, suffix: "/7", label: "ให้บริการตลอด" },
    { icon: <Users className="w-5 h-5" />, value: 3200, suffix: "+", label: "ลูกค้าที่พึงพอใจ" },
  ],
};

export function StatsSection() {
  const { lang } = useLanguage();
  const currentStats = stats[lang];

  return (
    <section className="py-12 lg:py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-gold)]/5 via-transparent to-[var(--color-gold)]/5" />
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
              <div className="glass-card rounded-2xl p-6 lg:p-8 hover:border-[var(--color-gold)]/40 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-gold)]/0 to-[var(--color-gold)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 flex items-center justify-center text-[var(--color-gold)] mx-auto mb-4 group-hover:bg-[var(--color-gold)]/20 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(213,181,99,0.2)] transition-all">
                    {stat.icon}
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold gradient-gold-text drop-shadow-sm mb-1">
                    {stat.isDecimal ? (
                      <span className="tabular-nums">4.9</span>
                    ) : (
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    )}
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
