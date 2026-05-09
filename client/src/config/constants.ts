import {
  Car, Plane, CreditCard, Award, Headphones, Shield, MessageCircle,
} from "lucide-react";
import { createElement } from "react";

// CDN Image URLs
export const IMAGES = {
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029898140/7JGRSFRRiiGdqokZA4QqP6/honda-city-2012-white-35WWrBNiUGHkRQuVZe7AWd.webp",
  airport: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029898140/7JGRSFRRiiGdqokZA4QqP6/citi-2012-white-exterior-side-AT3LpncDoVAtnbUSRKuzaR.webp",
  pattaya: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029898140/7JGRSFRRiiGdqokZA4QqP6/citi-2012-white-scenic-view-UfwzRWwfDcLP6jMG7y5ahg.webp",
  interior: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029898140/7JGRSFRRiiGdqokZA4QqP6/citi-2012-white-interior-seats-UtCHYQyJqrsrawojhP5T7a.webp",
  bangkok: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029898140/7JGRSFRRiiGdqokZA4QqP6/citi-2012-white-front-view-kmz53xVgoyPF8w6GoHNcWe.webp",
  logo: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029898140/7JGRSFRRiiGdqokZA4QqP6/logo-JdAMoyATex4yrTTU4EPBor.png",
};

// Contact URLs
export const WHATSAPP_URL = "https://wa.me/66829824986";
export const LINE_URL = "https://line.me/ti/p/~suriwandusit";
export const PHONE = "+66 82 982 4986";

// Icon map for dynamic rendering
export const iconMap: Record<string, React.ReactNode> = {
  car: createElement(Car, { className: "w-6 h-6" }),
  plane: createElement(Plane, { className: "w-6 h-6" }),
  creditcard: createElement(CreditCard, { className: "w-6 h-6" }),
  award: createElement(Award, { className: "w-6 h-6" }),
  headphones: createElement(Headphones, { className: "w-6 h-6" }),
  shield: createElement(Shield, { className: "w-6 h-6" }),
  messagecircle: createElement(MessageCircle, { className: "w-6 h-6" }),
};

// Framer Motion animation variants
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

// Gallery images
export const galleryImages = [
  { src: IMAGES.hero, alt: "Premium sedan on Thai highway", caption: "Premium Sedan" },
  { src: IMAGES.airport, alt: "Airport pickup service", caption: "Airport Pickup" },
  { src: IMAGES.pattaya, alt: "Pattaya beach destination", caption: "Pattaya Scenic" },
  { src: IMAGES.interior, alt: "Luxury car interior", caption: "Spacious Interior" },
  { src: IMAGES.bangkok, alt: "Bangkok city skyline", caption: "Bangkok City" },
];

// Utility
export const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};
