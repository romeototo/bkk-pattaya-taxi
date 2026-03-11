import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChatWidget } from "@/components/ChatWidget";
import { PlacesAutocomplete } from "@/components/PlacesAutocomplete";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Car, Phone, MessageCircle, MapPin, Clock, Shield, Star, Users,
  Luggage, ChevronDown, ArrowRight, CheckCircle, Globe, Plane,
  Navigation, Award, Headphones, CreditCard, Menu, X
} from "lucide-react";

// CDN Image URLs
const IMAGES = {
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029898140/7JGRSFRRiiGdqokZA4QqP6/honda-city-2012-white-35WWrBNiUGHkRQuVZe7AWd.webp",
  airport: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029898140/7JGRSFRRiiGdqokZA4QqP6/citi-2012-white-exterior-side-AT3LpncDoVAtnbUSRKuzaR.webp",
  pattaya: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029898140/7JGRSFRRiiGdqokZA4QqP6/citi-2012-white-scenic-view-UfwzRWwfDcLP6jMG7y5ahg.webp",
  interior: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029898140/7JGRSFRRiiGdqokZA4QqP6/citi-2012-white-interior-seats-UtCHYQyJqrsrawojhP5T7a.webp",
  bangkok: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029898140/7JGRSFRRiiGdqokZA4QqP6/citi-2012-white-front-view-kmz53xVgoyPF8w6GoHNcWe.webp",
  logo: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029898140/7JGRSFRRiiGdqokZA4QqP6/logo-JdAMoyATex4yrTTU4EPBor.png",
};

const WHATSAPP_URL = "https://wa.me/66971729666";
const LINE_URL = "https://line.me/ti/p/~suriwandusit";
const PHONE = "+66 97 172 9666";

// i18n translations
const translations = {
  en: {
    nav: { services: "Services", whyUs: "Why Us", reviews: "Reviews", gallery: "Gallery", faq: "FAQ", contact: "Contact", bookNow: "Book Now" },
    hero: {
      badge: "Premium Private Transfer Service",
      h1: "Bangkok to Pattaya Taxi",
      h1span: "Private Transfer Service",
      subtitle: "Experience the comfort of a private transfer from Bangkok to Pattaya with fixed pricing, professional English-speaking drivers, and door-to-door service.",
      bookNow: "Book Now",
      whatsapp: "Chat on WhatsApp",
      features: ["Private Car Only", "Fixed Price", "Airport Pickup", "English Speaking Driver"],
    },
    services: {
      title: "Popular Routes",
      subtitle: "Choose your route and enjoy a comfortable private transfer",
      routes: [
        { name: "Bangkok → Pattaya", price: "From ฿1,500", desc: "Door-to-door private transfer from any location in Bangkok to your hotel in Pattaya. Approximately 1.5-2 hours.", icon: "car" },
        { name: "Pattaya → Bangkok", price: "From ฿1,500", desc: "Return transfer from Pattaya to Bangkok city center, hotel, or any location. Comfortable and reliable.", icon: "car" },
        { name: "Suvarnabhumi Airport → Pattaya", price: "From ฿1,500", desc: "Meet & greet at arrival hall. Your driver will hold a name sign and assist with luggage.", icon: "plane" },
        { name: "Don Mueang Airport → Pattaya", price: "From ฿1,500", desc: "Pickup from Don Mueang International Airport with flight monitoring and free waiting time.", icon: "plane" },
      ],
    },
    whyUs: {
      title: "Why Choose Us",
      subtitle: "We provide premium private transfer service trusted by thousands of international travelers",
      items: [
        { title: "Fixed Price Guarantee", desc: "No hidden charges, no surge pricing. The price you see is the price you pay, including tolls and fuel.", icon: "creditcard" },
        { title: "Professional Drivers", desc: "All our drivers are licensed, experienced, and English-speaking. Your safety and comfort are our priority.", icon: "award" },
        { title: "24/7 Service", desc: "Available around the clock for early morning flights, late night arrivals, or any time you need us.", icon: "headphones" },
        { title: "Private Transfer Only", desc: "No ride sharing. Your car is exclusively for you and your group. Enjoy privacy and comfort.", icon: "shield" },
        { title: "Airport Meet & Greet", desc: "Our driver meets you at the arrival hall with a name sign. Free waiting time for flight delays.", icon: "plane" },
        { title: "Easy Booking", desc: "Book instantly via WhatsApp or LINE. Quick confirmation and flexible cancellation policy.", icon: "messagecircle" },
      ],
    },
    reviews: {
      title: "What Our Customers Say",
      subtitle: "Trusted by thousands of international travelers",
      items: [
        { name: "James Wilson", country: "United Kingdom", text: "Excellent service! Driver was punctual and very professional. The car was clean and comfortable. Highly recommend for anyone traveling from Bangkok to Pattaya.", rating: 5 },
        { name: "Sarah Johnson", country: "United States", text: "Best transfer service in Thailand! Fixed price, no hassle. The driver was waiting at the airport with my name sign. Very smooth experience.", rating: 5 },
        { name: "Hans Mueller", country: "Germany", text: "We used this service for our family trip. The van was spacious and the driver was very helpful with our luggage. Great value for money.", rating: 5 },
        { name: "Yuki Tanaka", country: "Japan", text: "Very reliable and comfortable. The driver spoke good English and was very friendly. Will definitely use again on my next trip to Thailand.", rating: 5 },
        { name: "Pierre Dubois", country: "France", text: "Booked via WhatsApp and got instant confirmation. The car was waiting for us at the hotel lobby. Smooth ride to Pattaya. Merci!", rating: 5 },
        { name: "Emma Chen", country: "Australia", text: "Used this service twice during our Thailand holiday. Both times were perfect. Clean car, safe driving, and very reasonable price.", rating: 5 },
      ],
    },
    booking: {
      title: "Book Your Transfer",
      subtitle: "Fill in the form below and we will confirm your booking within minutes",
      pickup: "Pickup Location",
      dropoff: "Drop-off Location",
      date: "Date",
      time: "Time",
      passengers: "Passengers",
      luggage: "Luggage (pieces)",
      contact: "Contact (WhatsApp / Email / Phone)",
      contactMethod: "Preferred Contact Method",
      notes: "Special Requests or Notes",
      submit: "Send Booking Inquiry",
      success: "Booking inquiry sent successfully! We will contact you shortly.",
      whatsappMsg: "Opening WhatsApp with your booking details...",
    },
    gallery: {
      title: "Our Fleet & Destinations",
      subtitle: "Premium vehicles and beautiful destinations await you",
    },
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about our service",
      items: [
        { q: "Is the price fixed?", a: "Yes, we offer fixed pricing with no hidden charges. The price you see is the price you pay, including highway tolls and fuel. No surge pricing, no surprises." },
        { q: "Can I book airport pickup?", a: "Yes, we provide airport pickup service from both Suvarnabhumi (BKK) and Don Mueang (DMK) airports. Our driver will meet you at the arrival hall with a name sign and assist with your luggage." },
        { q: "How long is the trip from Bangkok to Pattaya?", a: "The trip typically takes 1.5 to 2 hours depending on traffic conditions. From Suvarnabhumi Airport, it takes approximately 1.5 hours via the motorway." },
        { q: "Can I bring luggage?", a: "Yes, our vehicles have spacious luggage compartments. Standard sedans can accommodate 2-3 large suitcases, and our vans can handle up to 8 large suitcases." },
        { q: "What payment methods do you accept?", a: "We accept cash (Thai Baht), bank transfer, and can arrange other payment methods upon request. Payment is made directly to the driver or in advance via bank transfer." },
        { q: "Can I cancel or change my booking?", a: "Yes, free cancellation or changes up to 12 hours before pickup time. Please contact us via WhatsApp or LINE to make changes." },
      ],
    },
    contact: {
      title: "Get In Touch",
      subtitle: "Ready to book? Contact us through your preferred channel",
      whatsapp: "Chat on WhatsApp",
      line: "Add us on LINE",
      phone: "Call Us",
      lineId: "LINE ID: suriwandusit",
    },
    footer: {
      desc: "Premium private taxi transfer service between Bangkok and Pattaya. Fixed price, professional drivers, and comfortable vehicles for international travelers.",
      quickLinks: "Quick Links",
      contactInfo: "Contact Info",
      serviceAreas: "Service Areas",
      areas: ["Bangkok City Center", "Suvarnabhumi Airport (BKK)", "Don Mueang Airport (DMK)", "Pattaya", "Jomtien Beach", "Walking Street Pattaya"],
      copyright: "© 2025 BKK Pattaya Private Taxi. All rights reserved.",
    },
  },
  th: {
    nav: { services: "บริการ", whyUs: "ทำไมเลือกเรา", reviews: "รีวิว", gallery: "แกลเลอรี่", faq: "คำถาม", contact: "ติดต่อ", bookNow: "จองเลย" },
    hero: {
      badge: "บริการรถเช่าส่วนตัวระดับพรีเมียม",
      h1: "แท็กซี่กรุงเทพ-พัทยา",
      h1span: "บริการรถรับส่งส่วนตัว",
      subtitle: "สัมผัสความสะดวกสบายของบริการรถรับส่งส่วนตัวจากกรุงเทพไปพัทยา ราคาคงที่ คนขับพูดภาษาอังกฤษได้ บริการถึงหน้าประตู",
      bookNow: "จองเลย",
      whatsapp: "แชทผ่าน WhatsApp",
      features: ["รถส่วนตัวเท่านั้น", "ราคาคงที่", "รับที่สนามบิน", "คนขับพูดอังกฤษได้"],
    },
    services: {
      title: "เส้นทางยอดนิยม",
      subtitle: "เลือกเส้นทางและเพลิดเพลินกับการเดินทางที่สะดวกสบาย",
      routes: [
        { name: "กรุงเทพ → พัทยา", price: "เริ่มต้น ฿1,200", desc: "บริการรับส่งส่วนตัวจากทุกที่ในกรุงเทพไปโรงแรมในพัทยา ใช้เวลาประมาณ 1.5-2 ชั่วโมง", icon: "car" },
        { name: "พัทยา → กรุงเทพ", price: "เริ่มต้น ฿1,200", desc: "บริการรับส่งกลับจากพัทยาไปกรุงเทพ สะดวกและเชื่อถือได้", icon: "car" },
        { name: "สนามบินสุวรรณภูมิ → พัทยา", price: "เริ่มต้น ฿1,100", desc: "พบคนขับที่ห้องรับผู้โดยสาร พร้อมป้ายชื่อและช่วยขนกระเป๋า", icon: "plane" },
        { name: "สนามบินดอนเมือง → พัทยา", price: "เริ่มต้น ฿1,300", desc: "รับจากสนามบินดอนเมือง พร้อมติดตามเที่ยวบินและเวลารอฟรี", icon: "plane" },
      ],
    },
    whyUs: {
      title: "ทำไมต้องเลือกเรา",
      subtitle: "เราให้บริการรถรับส่งส่วนตัวระดับพรีเมียมที่ได้รับความไว้วางใจจากนักท่องเที่ยวต่างชาตินับพัน",
      items: [
        { title: "ราคาคงที่", desc: "ไม่มีค่าใช้จ่ายแอบแฝง ไม่มีราคาพุ่ง ราคาที่คุณเห็นคือราคาที่คุณจ่าย รวมค่าทางด่วนและน้ำมัน", icon: "creditcard" },
        { title: "คนขับมืออาชีพ", desc: "คนขับทุกคนมีใบอนุญาต มีประสบการณ์ และพูดภาษาอังกฤษได้ ความปลอดภัยและความสะดวกสบายของคุณคือสิ่งสำคัญ", icon: "award" },
        { title: "บริการ 24 ชั่วโมง", desc: "พร้อมให้บริการตลอด 24 ชั่วโมง ไม่ว่าจะเที่ยวบินเช้าหรือดึก", icon: "headphones" },
        { title: "รถส่วนตัวเท่านั้น", desc: "ไม่มีการแชร์รถ รถของคุณเป็นของคุณและกลุ่มของคุณเท่านั้น", icon: "shield" },
        { title: "รับที่สนามบิน", desc: "คนขับรอรับที่ห้องรับผู้โดยสารพร้อมป้ายชื่อ รอฟรีกรณีเที่ยวบินล่าช้า", icon: "plane" },
        { title: "จองง่าย", desc: "จองทันทีผ่าน WhatsApp หรือ LINE ยืนยันรวดเร็วและนโยบายยกเลิกยืดหยุ่น", icon: "messagecircle" },
      ],
    },
    reviews: {
      title: "ลูกค้าพูดถึงเรา",
      subtitle: "ได้รับความไว้วางใจจากนักท่องเที่ยวต่างชาตินับพัน",
      items: [
        { name: "James Wilson", country: "สหราชอาณาจักร", text: "บริการยอดเยี่ยม! คนขับตรงเวลาและเป็นมืออาชีพมาก รถสะอาดและสะดวกสบาย แนะนำสำหรับทุกคนที่เดินทางจากกรุงเทพไปพัทยา", rating: 5 },
        { name: "Sarah Johnson", country: "สหรัฐอเมริกา", text: "บริการรับส่งที่ดีที่สุดในไทย! ราคาคงที่ ไม่ยุ่งยาก คนขับรอที่สนามบินพร้อมป้ายชื่อ ประสบการณ์ราบรื่นมาก", rating: 5 },
        { name: "Hans Mueller", country: "เยอรมนี", text: "เราใช้บริการนี้สำหรับทริปครอบครัว รถตู้กว้างขวางและคนขับช่วยเรื่องกระเป๋าดีมาก คุ้มค่ามาก", rating: 5 },
        { name: "Yuki Tanaka", country: "ญี่ปุ่น", text: "เชื่อถือได้และสะดวกสบายมาก คนขับพูดภาษาอังกฤษได้ดีและเป็นมิตรมาก จะใช้อีกแน่นอนในทริปหน้า", rating: 5 },
        { name: "Pierre Dubois", country: "ฝรั่งเศส", text: "จองผ่าน WhatsApp และได้รับการยืนยันทันที รถรอที่ล็อบบี้โรงแรม เดินทางไปพัทยาราบรื่น", rating: 5 },
        { name: "Emma Chen", country: "ออสเตรเลีย", text: "ใช้บริการสองครั้งในวันหยุดที่ไทย ทั้งสองครั้งสมบูรณ์แบบ รถสะอาด ขับปลอดภัย ราคาสมเหตุสมผล", rating: 5 },
      ],
    },
    booking: {
      title: "จองรถรับส่ง",
      subtitle: "กรอกแบบฟอร์มด้านล่างและเราจะยืนยันการจองภายในไม่กี่นาที",
      pickup: "สถานที่รับ",
      dropoff: "สถานที่ส่ง",
      date: "วันที่",
      time: "เวลา",
      passengers: "จำนวนผู้โดยสาร",
      luggage: "จำนวนกระเป๋า",
      contact: "ข้อมูลติดต่อ (WhatsApp / อีเมล / โทรศัพท์)",
      contactMethod: "ช่องทางติดต่อที่ต้องการ",
      notes: "คำขอพิเศษหรือหมายเหตุ",
      submit: "ส่งคำขอจอง",
      success: "ส่งคำขอจองสำเร็จ! เราจะติดต่อกลับในเร็วๆ นี้",
      whatsappMsg: "กำลังเปิด WhatsApp พร้อมรายละเอียดการจอง...",
    },
    gallery: {
      title: "รถและจุดหมายปลายทาง",
      subtitle: "รถระดับพรีเมียมและจุดหมายปลายทางที่สวยงามรอคุณอยู่",
    },
    faq: {
      title: "คำถามที่พบบ่อย",
      subtitle: "ทุกสิ่งที่คุณต้องรู้เกี่ยวกับบริการของเรา",
      items: [
        { q: "ราคาคงที่หรือไม่?", a: "ใช่ เราเสนอราคาคงที่โดยไม่มีค่าใช้จ่ายแอบแฝง ราคาที่คุณเห็นคือราคาที่คุณจ่าย รวมค่าทางด่วนและน้ำมัน ไม่มีราคาพุ่ง ไม่มีเซอร์ไพรส์" },
        { q: "จองรับที่สนามบินได้ไหม?", a: "ได้ เราให้บริการรับที่สนามบินทั้งสุวรรณภูมิ (BKK) และดอนเมือง (DMK) คนขับจะรอที่ห้องรับผู้โดยสารพร้อมป้ายชื่อและช่วยขนกระเป๋า" },
        { q: "เดินทางจากกรุงเทพไปพัทยาใช้เวลานานเท่าไหร่?", a: "การเดินทางใช้เวลาประมาณ 1.5-2 ชั่วโมง ขึ้นอยู่กับสภาพการจราจร จากสนามบินสุวรรณภูมิใช้เวลาประมาณ 1.5 ชั่วโมงผ่านมอเตอร์เวย์" },
        { q: "นำกระเป๋าไปได้ไหม?", a: "ได้ รถของเรามีพื้นที่กระเป๋ากว้างขวาง รถเก๋งรองรับกระเป๋าใบใหญ่ 2-3 ใบ และรถตู้รองรับได้ถึง 8 ใบ" },
        { q: "รับวิธีชำระเงินอะไรบ้าง?", a: "เรารับเงินสด (บาท) โอนเงินผ่านธนาคาร และสามารถจัดวิธีชำระเงินอื่นๆ ได้ตามคำขอ" },
        { q: "ยกเลิกหรือเปลี่ยนแปลงการจองได้ไหม?", a: "ได้ ยกเลิกหรือเปลี่ยนแปลงฟรีก่อนเวลารับ 12 ชั่วโมง กรุณาติดต่อเราผ่าน WhatsApp หรือ LINE" },
      ],
    },
    contact: {
      title: "ติดต่อเรา",
      subtitle: "พร้อมจอง? ติดต่อเราผ่านช่องทางที่คุณสะดวก",
      whatsapp: "แชทผ่าน WhatsApp",
      line: "เพิ่มเราใน LINE",
      phone: "โทรหาเรา",
      lineId: "LINE ID: suriwandusit",
    },
    footer: {
      desc: "บริการแท็กซี่รับส่งส่วนตัวระดับพรีเมียมระหว่างกรุงเทพและพัทยา ราคาคงที่ คนขับมืออาชีพ และรถสะดวกสบายสำหรับนักท่องเที่ยวต่างชาติ",
      quickLinks: "ลิงก์ด่วน",
      contactInfo: "ข้อมูลติดต่อ",
      serviceAreas: "พื้นที่ให้บริการ",
      areas: ["ใจกลางกรุงเทพ", "สนามบินสุวรรณภูมิ (BKK)", "สนามบินดอนเมือง (DMK)", "พัทยา", "หาดจอมเทียน", "วอล์คกิ้งสตรีทพัทยา"],
      copyright: "© 2025 BKK Pattaya Private Taxi สงวนลิขสิทธิ์",
    },
  },
};

type Lang = "en" | "th";

const iconMap: Record<string, React.ReactNode> = {
  car: <Car className="w-6 h-6" />,
  plane: <Plane className="w-6 h-6" />,
  creditcard: <CreditCard className="w-6 h-6" />,
  award: <Award className="w-6 h-6" />,
  headphones: <Headphones className="w-6 h-6" />,
  shield: <Shield className="w-6 h-6" />,
  messagecircle: <MessageCircle className="w-6 h-6" />,
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang];

  // Booking form state
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    date: "",
    time: "",
    passengers: "2",
    luggage: "2",
    contact: "",
    contactMethod: "whatsapp",
    notes: "",
  });

  const createBooking = trpc.booking.create.useMutation({
    onSuccess: () => {
      toast.success(t.booking.success);
      // Open WhatsApp with booking details
      const msg = encodeURIComponent(
        `Hello! I'd like to book a transfer:\n\n` +
        `📍 From: ${formData.pickupLocation}\n` +
        `📍 To: ${formData.dropoffLocation}\n` +
        `📅 Date: ${formData.date}\n` +
        `🕐 Time: ${formData.time}\n` +
        `👥 Passengers: ${formData.passengers}\n` +
        `🧳 Luggage: ${formData.luggage}\n` +
        `${formData.notes ? `📝 Notes: ${formData.notes}` : ""}`
      );
      window.open(`${WHATSAPP_URL}?text=${msg}`, "_blank");
    },
    onError: (err) => {
      toast.error("Failed to send booking. Please try again or contact us directly.");
      console.error(err);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBooking.mutate({
      ...formData,
      passengers: parseInt(formData.passengers),
      luggage: parseInt(formData.luggage),
      contactMethod: formData.contactMethod as "whatsapp" | "email" | "phone",
    });
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const galleryImages = useMemo(() => [
    { src: IMAGES.hero, alt: "Premium sedan on Thai highway" },
    { src: IMAGES.airport, alt: "Airport pickup service" },
    { src: IMAGES.pattaya, alt: "Pattaya beach destination" },
    { src: IMAGES.interior, alt: "Luxury car interior" },
    { src: IMAGES.bangkok, alt: "Bangkok city skyline" },
  ], []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
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
            {[
              { label: t.nav.services, id: "services" },
              { label: t.nav.whyUs, id: "why-us" },
              { label: t.nav.reviews, id: "reviews" },
              { label: t.nav.gallery, id: "gallery" },
              { label: t.nav.faq, id: "faq" },
              { label: t.nav.contact, id: "contact" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === "en" ? "th" : "en")}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-md border border-border"
            >
              <Globe className="w-4 h-4" />
              {lang === "en" ? "TH" : "EN"}
            </button>

            <Button
              onClick={() => scrollTo("booking")}
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
              {[
                { label: t.nav.services, id: "services" },
                { label: t.nav.whyUs, id: "why-us" },
                { label: t.nav.reviews, id: "reviews" },
                { label: t.nav.gallery, id: "gallery" },
                { label: t.nav.faq, id: "faq" },
                { label: t.nav.contact, id: "contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-left text-sm text-muted-foreground hover:text-primary transition-colors py-2"
                >
                  {item.label}
                </button>
              ))}
              <Button
                onClick={() => scrollTo("booking")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
                size="sm"
              >
                {t.nav.bookNow}
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0">
          <img
            src={IMAGES.hero}
            alt="Premium taxi service Bangkok to Pattaya"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-2xl"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-6">
              <Car className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">{t.hero.badge}</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-4">
              {t.hero.h1}
              <span className="block gradient-text mt-2">{t.hero.h1span}</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
              {t.hero.subtitle}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 mb-10">
              <Button
                size="lg"
                onClick={() => scrollTo("booking")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6 shadow-lg shadow-primary/25"
              >
                {t.hero.bookNow}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.open(WHATSAPP_URL, "_blank")}
                className="text-base px-8 py-6 border-primary/30 text-primary hover:bg-primary/10"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {t.hero.whatsapp}
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {t.hero.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Popular Routes / Services Section */}
      <section id="services" className="py-20 lg:py-28">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-serif font-bold mb-4">
              {t.services.title}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto">
              {t.services.subtitle}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {t.services.routes.map((route, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="glass-card hover:border-primary/40 transition-all duration-300 group h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                      {iconMap[route.icon]}
                    </div>
                    <h3 className="font-serif text-lg font-semibold mb-2 text-foreground">{route.name}</h3>
                    <p className="text-primary font-semibold text-xl mb-3">{route.price}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{route.desc}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-4 text-primary hover:text-primary/80 p-0"
                      onClick={() => scrollTo("booking")}
                    >
                      {t.nav.bookNow} <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-us" className="py-20 lg:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-serif font-bold mb-4">
              {t.whyUs.title}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto">
              {t.whyUs.subtitle}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {t.whyUs.items.map((item, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="glass-card hover:border-primary/40 transition-all duration-300 group h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                      {iconMap[item.icon]}
                    </div>
                    <h3 className="font-serif text-lg font-semibold mb-2 text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 lg:py-28">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-serif font-bold mb-4">
              {t.reviews.title}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto">
              {t.reviews.subtitle}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {t.reviews.items.map((review, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="glass-card hover:border-primary/40 transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 italic">
                      "{review.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                        {review.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{review.name}</p>
                        <p className="text-xs text-muted-foreground">{review.country}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking" className="py-20 lg:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-serif font-bold mb-4">
              {t.booking.title}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto">
              {t.booking.subtitle}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <Card className="glass-card max-w-3xl mx-auto">
              <CardContent className="p-6 lg:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">{t.booking.pickup}</label>
                      <PlacesAutocomplete
                        value={formData.pickupLocation}
                        onChange={(val) => setFormData({ ...formData, pickupLocation: val })}
                        placeholder="e.g., Suvarnabhumi Airport"
                        className="bg-input border-border"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">{t.booking.dropoff}</label>
                      <PlacesAutocomplete
                        value={formData.dropoffLocation}
                        onChange={(val) => setFormData({ ...formData, dropoffLocation: val })}
                        placeholder="e.g., Hilton Pattaya"
                        className="bg-input border-border"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">{t.booking.date}</label>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="bg-input border-border"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">{t.booking.time}</label>
                      <Input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="bg-input border-border"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">{t.booking.passengers}</label>
                      <Select value={formData.passengers} onValueChange={(v) => setFormData({ ...formData, passengers: v })}>
                        <SelectTrigger className="bg-input border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                            <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "passenger" : "passengers"}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">{t.booking.luggage}</label>
                      <Select value={formData.luggage} onValueChange={(v) => setFormData({ ...formData, luggage: v })}>
                        <SelectTrigger className="bg-input border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "piece" : "pieces"}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">{t.booking.contact}</label>
                      <Input
                        placeholder="e.g., +1234567890"
                        value={formData.contact}
                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        className="bg-input border-border"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">{t.booking.contactMethod}</label>
                      <Select value={formData.contactMethod} onValueChange={(v) => setFormData({ ...formData, contactMethod: v })}>
                        <SelectTrigger className="bg-input border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">{t.booking.notes}</label>
                    <Textarea
                      placeholder="e.g., Child seat needed, flight number..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="bg-input border-border min-h-[80px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-base py-6 shadow-lg shadow-primary/25"
                    disabled={createBooking.isPending}
                  >
                    {createBooking.isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <>
                        {t.booking.submit}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 lg:py-28">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-serif font-bold mb-4">
              {t.gallery.title}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto">
              {t.gallery.subtitle}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className={`relative overflow-hidden rounded-xl group ${i === 0 ? "col-span-2 lg:col-span-2 row-span-2" : ""}`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover aspect-video group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="py-12 lg:py-16">
        <div className="container">
          <div className="rounded-xl overflow-hidden border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d496058.5!2d100.5!3d13.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e6!4m5!1s0x311d6032280d61f3%3A0x10100b25de24820!2sBangkok!3m2!1d13.7563309!2d100.5017651!4m5!1s0x3102b7e2d5e0f01d%3A0x10100b25de24880!2sPattaya!3m2!1d12.9235557!2d100.8824551!5e0!3m2!1sen!2sth!4v1709000000000!5m2!1sen!2sth"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bangkok to Pattaya route"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 lg:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-serif font-bold mb-4">
              {t.faq.title}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto">
              {t.faq.subtitle}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="max-w-3xl mx-auto"
          >
            <Accordion type="single" collapsible className="space-y-3">
              {t.faq.items.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="glass-card rounded-xl border-border px-6">
                  <AccordionTrigger className="text-left font-serif text-base font-semibold hover:text-primary transition-colors py-5">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 lg:py-28">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              {/* Left Column - Contact Cards */}
              <motion.div variants={fadeInUp} className="space-y-6">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-4 text-foreground">
                    {t.contact.title}
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    {t.contact.subtitle}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* WhatsApp Card */}
                  <motion.div variants={fadeInUp}>
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                      <Card className="glass-card hover:border-green-500/40 transition-all duration-300 group">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center text-white flex-shrink-0">
                              <MessageCircle className="w-7 h-7" />
                            </div>
                            <div>
                              <h3 className="font-serif font-semibold text-foreground">{t.contact.whatsapp}</h3>
                              <p className="text-sm text-muted-foreground">{PHONE}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  </motion.div>

                  {/* LINE Card */}
                  <motion.div variants={fadeInUp}>
                    <a href={LINE_URL} target="_blank" rel="noopener noreferrer">
                      <Card className="glass-card hover:border-green-400/40 transition-all duration-300 group">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-green-400 flex items-center justify-center flex-shrink-0">
                              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
                                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-serif font-semibold text-foreground">{t.contact.line}</h3>
                              <p className="text-sm text-muted-foreground">{t.contact.lineId}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  </motion.div>

                  {/* Call Card */}
                  <motion.div variants={fadeInUp}>
                    <a href={`tel:${PHONE.replace(/\s/g, "")}`}>
                      <Card className="glass-card hover:border-primary/40 transition-all duration-300 group">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white flex-shrink-0">
                              <Phone className="w-7 h-7" />
                            </div>
                            <div>
                              <h3 className="font-serif font-semibold text-foreground">{t.contact.phone}</h3>
                              <p className="text-sm text-muted-foreground">{PHONE}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right Column - QR Code */}
              <motion.div variants={fadeInUp} className="flex flex-col items-center justify-center">
                <div className="glass-card rounded-2xl p-8 w-full max-w-sm">
                  <h3 className="text-center text-xl font-serif font-semibold mb-6 text-foreground">
                    Scan to Add LINE
                  </h3>
                  <div className="bg-white rounded-xl p-4 mb-6 flex items-center justify-center">
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029898140/7JGRSFRRiiGdqokZA4QqP6/line-qr-code-ZPjY3dsdqZf4RZKTCRSFjc.webp"
                      alt="LINE QR Code"
                      className="w-full max-w-xs"
                    />
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    LINE ID: <span className="font-semibold text-foreground">suriwandusit</span>
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img src={IMAGES.logo} alt="BKK Pattaya Private Taxi" className="h-10 w-10" />
                <div>
                  <span className="font-serif text-lg font-semibold text-foreground">BKK Pattaya</span>
                  <span className="block text-xs text-muted-foreground -mt-1">Private Taxi</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t.footer.desc}
              </p>
            </div>

            <div>
              <h4 className="font-serif font-semibold text-foreground mb-4">{t.footer.quickLinks}</h4>
              <div className="space-y-2">
                {[
                  { label: t.nav.services, id: "services" },
                  { label: t.nav.whyUs, id: "why-us" },
                  { label: t.nav.reviews, id: "reviews" },
                  { label: t.nav.gallery, id: "gallery" },
                  { label: t.nav.faq, id: "faq" },
                  { label: t.nav.contact, id: "contact" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-serif font-semibold text-foreground mb-4">{t.footer.contactInfo}</h4>
              <div className="space-y-3">
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
                <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <MessageCircle className="w-4 h-4" /> LINE: suriwandusit
                </a>
                <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Phone className="w-4 h-4" /> {PHONE}
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-serif font-semibold text-foreground mb-4">{t.footer.serviceAreas}</h4>
              <div className="space-y-2">
                {t.footer.areas.map((area, i) => (
                  <p key={i} className="text-sm text-muted-foreground">{area}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center">
            <p className="text-sm text-muted-foreground">{t.footer.copyright}</p>
          </div>
        </div>
      </footer>

      {/* AI Chat Widget */}
      <ChatWidget lang={lang} />

      {/* Floating WhatsApp Button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 z-50 w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25 transition-all hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </a>
    </div>
  );
}
