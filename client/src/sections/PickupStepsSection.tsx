import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle, ClipboardCheck, MapPinned } from "lucide-react";

const copy = {
  en: {
    title: "How Airport Pickup Works",
    subtitle: "A simple pickup flow for travelers arriving in Thailand, especially when you are tired after a flight.",
    steps: [
      {
        icon: MessageCircle,
        title: "Send your trip details",
        body: "Share pickup point, hotel, date, time, passengers, luggage, and flight number if airport pickup is needed.",
      },
      {
        icon: ClipboardCheck,
        title: "Confirm price and driver",
        body: "You receive the confirmed route price, pickup instructions, and contact channel before the trip.",
      },
      {
        icon: MapPinned,
        title: "Meet at the pickup point",
        body: "For airport pickup, the driver meets you at the arrival area and helps with luggage before going to Pattaya.",
      },
    ],
  },
  th: {
    title: "ขั้นตอนรับที่สนามบิน",
    subtitle: "ออกแบบให้จองง่ายสำหรับคนเพิ่งถึงไทย เหนื่อยจากไฟลต์ และต้องการรถที่ไว้ใจได้",
    steps: [
      {
        icon: MessageCircle,
        title: "ส่งรายละเอียดการเดินทาง",
        body: "แจ้งจุดรับ โรงแรม วัน เวลา จำนวนคน กระเป๋า และเลขไฟลต์ถ้ารับที่สนามบิน",
      },
      {
        icon: ClipboardCheck,
        title: "ยืนยันราคาและคนขับ",
        body: "ยืนยันราคาตามเส้นทาง วิธีรับ และช่องทางติดต่อก่อนวันเดินทาง",
      },
      {
        icon: MapPinned,
        title: "เจอคนขับที่จุดรับ",
        body: "ถ้ารับที่สนามบิน คนขับจะรอที่บริเวณผู้โดยสารขาเข้าและช่วยยกกระเป๋าก่อนเดินทางไปพัทยา",
      },
    ],
  },
};

export function PickupStepsSection() {
  const { lang } = useLanguage();
  const c = copy[lang];

  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="mb-12 max-w-2xl">
          <h2 className="font-serif text-3xl font-bold lg:text-4xl">{c.title}</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">{c.subtitle}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {c.steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="rounded-lg border border-border/70 bg-card/70 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md border border-[var(--color-gold)]/25 bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-serif text-3xl text-foreground/20">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="font-serif text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
