import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { WHATSAPP_URL } from "@/config/constants";
import { ArrowRight, Calendar, MapPin, MessageCircle } from "lucide-react";

const copy = {
  en: {
    title: "Quick booking",
    subtitle: "Send the essentials first. We can confirm details in chat.",
    from: "Pickup",
    to: "Drop-off",
    date: "Date",
    phone: "WhatsApp or phone",
    fromPlaceholder: "BKK airport or Bangkok hotel",
    toPlaceholder: "Pattaya hotel or address",
    phonePlaceholder: "+66...",
    button: "Send quick request",
    message: "Hello, I would like to request a Bangkok Pattaya transfer.",
  },
  th: {
    title: "จองเร็ว",
    subtitle: "ส่งข้อมูลหลักก่อน แล้วค่อยยืนยันรายละเอียดในแชท",
    from: "จุดรับ",
    to: "จุดส่ง",
    date: "วันที่",
    phone: "WhatsApp หรือเบอร์โทร",
    fromPlaceholder: "สนามบิน BKK หรือโรงแรมในกรุงเทพ",
    toPlaceholder: "โรงแรมหรือที่อยู่ในพัทยา",
    phonePlaceholder: "+66...",
    button: "ส่งคำขอจองเร็ว",
    message: "สวัสดีครับ/ค่ะ ต้องการจองรถรับส่งกรุงเทพ พัทยา",
  },
};

export function QuickBookingSection() {
  const { lang } = useLanguage();
  const c = copy[lang];
  const [form, setForm] = useState({ from: "", to: "", date: "", phone: "" });

  const messageUrl = useMemo(() => {
    const message = [
      c.message,
      "",
      `Pickup: ${form.from || "-"}`,
      `Drop-off: ${form.to || "-"}`,
      `Date: ${form.date || "-"}`,
      `Phone/WhatsApp: ${form.phone || "-"}`,
    ].join("\n");

    return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
  }, [c.message, form]);

  return (
    <section className="relative z-20 -mt-8 pb-6 lg:-mt-12">
      <div className="container">
        <div className="rounded-lg border border-[var(--color-gold)]/25 bg-background/95 p-4 shadow-2xl shadow-background/40 lg:p-5">
          <div className="mb-4 flex flex-col gap-1 lg:hidden">
            <h2 className="font-serif text-xl font-bold">{c.title}</h2>
            <p className="text-sm text-muted-foreground">{c.subtitle}</p>
          </div>
          <div className="grid gap-3 lg:grid-cols-[0.8fr_1fr_1fr_160px_1fr_auto] lg:items-end">
            <div className="hidden lg:block">
              <h2 className="font-serif text-xl font-bold">{c.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{c.subtitle}</p>
            </div>
            <label className="grid gap-2 text-sm font-medium">
              <span className="flex items-center gap-1.5 text-foreground/75"><MapPin className="h-4 w-4 text-primary" />{c.from}</span>
              <Input value={form.from} onChange={(event) => setForm({ ...form, from: event.target.value })} placeholder={c.fromPlaceholder} className="bg-card/60" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              <span className="flex items-center gap-1.5 text-foreground/75"><MapPin className="h-4 w-4 text-primary" />{c.to}</span>
              <Input value={form.to} onChange={(event) => setForm({ ...form, to: event.target.value })} placeholder={c.toPlaceholder} className="bg-card/60" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              <span className="flex items-center gap-1.5 text-foreground/75"><Calendar className="h-4 w-4 text-primary" />{c.date}</span>
              <Input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="bg-card/60 [color-scheme:dark]" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              <span className="flex items-center gap-1.5 text-foreground/75"><MessageCircle className="h-4 w-4 text-primary" />{c.phone}</span>
              <Input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder={c.phonePlaceholder} className="bg-card/60" />
            </label>
            <Button asChild className="h-11 bg-[var(--color-gold)] text-background hover:bg-[oklch(0.86_0.12_85)]">
              <a href={messageUrl} target="_blank" rel="noopener noreferrer">
                {c.button}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
