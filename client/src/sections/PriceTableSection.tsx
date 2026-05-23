import { useLanguage } from "@/contexts/LanguageContext";
import { PRICING, formatPrice } from "@/config/pricing";
import { CheckCircle2, ShieldCheck } from "lucide-react";

const copy = {
  en: {
    title: "Clear Transfer Prices",
    subtitle: "The route price is shown before you book. Tollway, fuel, and private car service are included unless a custom stop is requested.",
    route: "Route",
    price: "From",
    included: "Included",
    note: "Final quote is confirmed in chat before the trip.",
    includes: ["Private car", "Tollway and fuel", "Door-to-door pickup", "No shared ride"],
    rows: [
      ["Bangkok city to Pattaya", PRICING.bkkToPattaya],
      ["Pattaya to Bangkok city", PRICING.pattayaToBkk],
      ["Suvarnabhumi Airport (BKK) to Pattaya", PRICING.suvarnabhumiToPattaya],
      ["Don Mueang Airport (DMK) to Pattaya", PRICING.donMueangToPattaya],
    ],
  },
  th: {
    title: "ราคาชัดเจนก่อนจอง",
    subtitle: "แจ้งราคาตามเส้นทางก่อนจอง รวมค่าทางด่วน ค่าน้ำมัน และรถส่วนตัว หากมีจุดแวะพิเศษจะยืนยันราคาในแชทก่อนเดินทาง",
    route: "เส้นทาง",
    price: "เริ่มต้น",
    included: "รวมในราคา",
    note: "ยืนยันราคาสุดท้ายในแชทก่อนเดินทาง",
    includes: ["รถส่วนตัว", "ค่าทางด่วนและน้ำมัน", "รับส่งถึงที่", "ไม่แชร์รถกับคนอื่น"],
    rows: [
      ["กรุงเทพ ไป พัทยา", PRICING.bkkToPattaya],
      ["พัทยา ไป กรุงเทพ", PRICING.pattayaToBkk],
      ["สนามบินสุวรรณภูมิ (BKK) ไป พัทยา", PRICING.suvarnabhumiToPattaya],
      ["สนามบินดอนเมือง (DMK) ไป พัทยา", PRICING.donMueangToPattaya],
    ],
  },
};

export function PriceTableSection() {
  const { lang } = useLanguage();
  const c = copy[lang];

  return (
    <section className="py-16 lg:py-20 border-y border-border/60 bg-secondary/10">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10 px-3 py-2 text-sm font-medium text-[var(--color-gold)]">
              <ShieldCheck className="h-4 w-4" />
              {c.included}
            </div>
            <h2 className="font-serif text-3xl font-bold leading-tight lg:text-4xl">{c.title}</h2>
            <p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">{c.subtitle}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {c.includes.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-foreground/75">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-border/70 bg-card/75">
            <div className="grid grid-cols-[1fr_auto] border-b border-border/70 bg-background/45 px-4 py-3 text-sm font-semibold text-foreground/75">
              <span>{c.route}</span>
              <span>{c.price}</span>
            </div>
            {c.rows.map(([route, price]) => (
              <div key={route} className="grid grid-cols-[1fr_auto] gap-4 border-b border-border/50 px-4 py-4 last:border-b-0">
                <span className="text-sm font-medium text-foreground">{route}</span>
                <span className="whitespace-nowrap font-serif text-xl font-bold text-[var(--color-gold)]">{formatPrice(price as number)}</span>
              </div>
            ))}
            <div className="border-t border-border/70 bg-background/30 px-4 py-3 text-xs text-muted-foreground">{c.note}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
