import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { WHATSAPP_URL, scrollToSection } from "@/config/constants";
import { MessageCircle } from "lucide-react";

export function StickyMobileCta() {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/96 p-3 shadow-2xl shadow-background md:hidden">
      <div className="grid grid-cols-2 gap-3">
        <Button onClick={() => scrollToSection("booking")} className="h-11 bg-[var(--color-gold)] text-background hover:bg-[oklch(0.86_0.12_85)]">
          {t.nav.bookNow}
        </Button>
        <Button asChild variant="outline" className="h-11 border-primary/35 text-primary hover:bg-primary/10">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-4 w-4" />
            WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
