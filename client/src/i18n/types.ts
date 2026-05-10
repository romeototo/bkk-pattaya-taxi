export type Lang = "en" | "th";

export type Translations = {
  nav: { services: string; whyUs: string; reviews: string; gallery: string; faq: string; contact: string; bookNow: string };
  hero: { badge: string; h1: string; h1span: string; subtitle: string; bookNow: string; whatsapp: string; features: string[] };
  services: {
    title: string; subtitle: string;
    routes: Array<{ name: string; price: string; desc: string; icon: string }>;
  };
  whyUs: {
    title: string; subtitle: string;
    items: Array<{ title: string; desc: string; icon: string }>;
  };
  reviews: {
    title: string; subtitle: string;
    items: Array<{ name: string; country: string; text: string; rating: number }>;
  };
  booking: {
    title: string; subtitle: string; pickup: string; dropoff: string;
    date: string; time: string; fullName: string; email: string;
    phone: string; passengers: string; luggage: string;
    contactMethod: string; notes: string; submit: string; success: string;
    routeDetails: string; scheduleVehicle: string; contactSection: string;
    bookingSummary: string; estimatedTotal: string; fixedPrice: string; noCard: string;
    route: string; dateTime: string; pax: string; confirmBtn: string; bookBtn: string;
  };
  gallery: { title: string; subtitle: string };
  faq: { title: string; subtitle: string; items: Array<{ q: string; a: string }> };
  contact: { title: string; subtitle: string; whatsapp: string; line: string; phone: string; lineId: string };
  footer: {
    desc: string; quickLinks: string; contactInfo: string;
    serviceAreas: string; areas: string[]; copyright: string;
  };
};
