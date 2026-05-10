import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { IMAGES, scrollToSection } from "@/config/constants";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const { t, lang, toggleLang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (id: string) => {
    scrollToSection(id);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { label: t.nav.services, id: "services" },
    { label: t.nav.whyUs, id: "why-us" },
    { label: t.nav.reviews, id: "reviews" },
    { label: t.nav.gallery, id: "gallery" },
    { label: t.nav.faq, id: "faq" },
    { label: t.nav.contact, id: "contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card">
      <div className="container flex items-center justify-between h-16 lg:h-20">
        <div className="flex items-center gap-3">
          <img src={IMAGES.logo} alt="BKK Pattaya Private Taxi" className="h-10 w-10 lg:h-12 lg:w-12" />
          <div className="hidden sm:block">
            <span className="font-serif text-lg font-semibold text-foreground">BKK Pattaya</span>
            <span className="block text-xs text-muted-foreground -mt-1">Private Taxi</span>
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className="text-sm text-muted-foreground hover:text-[var(--color-gold)] transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="text-sm font-medium px-3 py-1.5 rounded-full border border-border hover:border-[var(--color-gold)]/40 transition-colors text-muted-foreground hover:text-[var(--color-gold)]"
            aria-label="Switch language"
          >
            {lang === "en" ? "ไทย" : "EN"}
          </button>

          <Button
            onClick={() => handleNav("booking")}
            className="hidden sm:flex bg-primary text-primary-foreground hover:bg-primary/90"
            size="sm"
          >
            {t.nav.bookNow}
          </Button>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-card border-t border-border">
          <div className="container py-4 flex flex-col gap-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className="text-left text-sm text-muted-foreground hover:text-[var(--color-gold)] transition-colors py-2"
              >
                {item.label}
              </button>
            ))}
            <Button
              onClick={() => handleNav("booking")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
              size="sm"
            >
              {t.nav.bookNow}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
