import { useLanguage } from "@/contexts/LanguageContext";
import { IMAGES, WHATSAPP_URL, LINE_URL, PHONE, scrollToSection } from "@/config/constants";
import { MessageCircle, Phone as PhoneIcon, MapPin, ChevronRight } from "lucide-react";

export function Footer() {
  const { t, lang } = useLanguage();

  const navItems = [
    { label: t.nav.services, id: "services" },
    { label: t.nav.whyUs, id: "why-us" },
    { label: t.nav.reviews, id: "reviews" },
    { label: t.nav.gallery, id: "gallery" },
    { label: t.nav.faq, id: "faq" },
    { label: t.nav.contact, id: "contact" },
  ];

  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={IMAGES.logo} alt="BKK Pattaya Private Taxi" className="h-10 w-10" />
              <div>
                <span className="font-serif text-lg font-semibold text-foreground">BKK Pattaya</span>
                <span className="block text-xs text-muted-foreground -mt-1">Private Taxi</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{t.footer.desc}</p>
            {/* Social row */}
            <div className="flex items-center gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 hover:bg-green-500/20 transition-colors"
                aria-label="LINE"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`tel:${PHONE.replace(/\s/g, "")}`}
                className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-colors"
                aria-label="Phone"
              >
                <PhoneIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-foreground mb-4">{t.footer.quickLinks}</h4>
            <div className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all group"
                >
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif font-semibold text-foreground mb-4">{t.footer.contactInfo}</h4>
            <div className="space-y-3">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="w-4 h-4 shrink-0" /> WhatsApp
              </a>
              <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="w-4 h-4 shrink-0" /> LINE: suriwandusit
              </a>
              <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                <PhoneIcon className="w-4 h-4 shrink-0" /> {PHONE}
              </a>
            </div>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="font-serif font-semibold text-foreground mb-4">{t.footer.serviceAreas}</h4>
            <div className="space-y-2">
              {t.footer.areas.map((area, i) => (
                <p key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3 text-primary/60 shrink-0" />
                  {area}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-border/30">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">{t.footer.copyright}</p>
          <div className="flex items-center gap-4">
            <a href={`${import.meta.env.BASE_URL}legal`} className="text-xs text-muted-foreground hover:text-primary transition-colors">
              {lang === "th" ? "เงื่อนไขการใช้งาน" : "Terms & Privacy"}
            </a>
            <p className="text-xs text-muted-foreground">🇹🇭 {lang === "th" ? "ให้บริการกรุงเทพฯ พัทยา และพื้นที่ใกล้เคียง" : "Serving Bangkok, Pattaya & surrounding areas"}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
