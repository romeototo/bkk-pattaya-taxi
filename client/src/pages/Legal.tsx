import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, FileText } from "lucide-react";
import { Link } from "wouter";

const content = {
  en: {
    backHome: "Back to Home",
    terms: {
      title: "Terms of Service",
      lastUpdated: "Last updated: May 2026",
      sections: [
        {
          heading: "1. Service Overview",
          text: "BKK Pattaya Private Taxi provides private transfer services between Bangkok, Pattaya, and surrounding areas in Thailand. All bookings are subject to availability and confirmation."
        },
        {
          heading: "2. Booking & Confirmation",
          text: "Bookings are made through our website form or WhatsApp. A booking is confirmed once you receive a confirmation message from our team. We recommend booking at least 24 hours in advance."
        },
        {
          heading: "3. Pricing",
          text: "All prices displayed on our website are fixed and include highway tolls, fuel, and standard luggage. There are no hidden fees. Prices may vary for special routes or additional stops."
        },
        {
          heading: "4. Cancellation Policy",
          text: "Free cancellation is available up to 24 hours before the scheduled pickup time. Cancellations made within 24 hours may be subject to a cancellation fee. Contact us via WhatsApp to cancel."
        },
        {
          heading: "5. Passenger Responsibilities",
          text: "Passengers must provide accurate pickup information including flight numbers for airport pickups. Passengers are responsible for their personal belongings during and after the transfer."
        },
        {
          heading: "6. Payment",
          text: "Payment is made directly to the driver upon completion of the transfer. We accept Thai Baht (cash). Other payment methods can be arranged in advance."
        },
        {
          heading: "7. Limitation of Liability",
          text: "While we strive to provide the best service, we are not liable for delays caused by traffic conditions, weather, or circumstances beyond our control. We maintain comprehensive insurance for all passengers."
        },
      ]
    },
    privacy: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: May 2026",
      sections: [
        {
          heading: "1. Information We Collect",
          text: "We collect only the information necessary to provide our transfer service: your name, phone number, email (optional), pickup/drop-off locations, travel dates, and any special requests."
        },
        {
          heading: "2. How We Use Your Information",
          text: "Your information is used solely to arrange and complete your transfer booking, communicate with you about your booking, and improve our services."
        },
        {
          heading: "3. Data Sharing",
          text: "We do not sell, trade, or rent your personal information to third parties. Your booking details are shared only with the assigned driver for the purpose of completing your transfer."
        },
        {
          heading: "4. Data Security",
          text: "We take reasonable measures to protect your personal information. Communication through WhatsApp is encrypted end-to-end by WhatsApp's security protocols."
        },
        {
          heading: "5. Cookies",
          text: "Our website uses minimal cookies for language preferences and basic functionality. We do not use tracking cookies or share data with advertising networks."
        },
        {
          heading: "6. Contact",
          text: "For any questions about these policies or your personal data, please contact us via WhatsApp at +66 82 982 4986."
        },
      ]
    }
  },
  th: {
    backHome: "กลับหน้าหลัก",
    terms: {
      title: "ข้อกำหนดการให้บริการ",
      lastUpdated: "อัปเดตล่าสุด: พฤษภาคม 2569",
      sections: [
        {
          heading: "1. ภาพรวมบริการ",
          text: "BKK Pattaya Private Taxi ให้บริการรถรับส่งส่วนตัวระหว่างกรุงเทพฯ พัทยา และพื้นที่โดยรอบในประเทศไทย การจองทั้งหมดขึ้นอยู่กับความพร้อมและการยืนยัน"
        },
        {
          heading: "2. การจองและการยืนยัน",
          text: "การจองผ่านแบบฟอร์มบนเว็บไซต์หรือ WhatsApp การจองจะได้รับการยืนยันเมื่อคุณได้รับข้อความยืนยันจากทีมงาน แนะนำให้จองล่วงหน้าอย่างน้อย 24 ชั่วโมง"
        },
        {
          heading: "3. ราคา",
          text: "ราคาทั้งหมดที่แสดงบนเว็บไซต์เป็นราคาคงที่ รวมค่าทางด่วน ค่าน้ำมัน และกระเป๋าเดินทางมาตรฐาน ไม่มีค่าใช้จ่ายแอบแฝง ราคาอาจแตกต่างสำหรับเส้นทางพิเศษหรือจุดจอดเพิ่มเติม"
        },
        {
          heading: "4. นโยบายการยกเลิก",
          text: "ยกเลิกฟรีได้ก่อนเวลารับ 24 ชั่วโมง การยกเลิกภายใน 24 ชั่วโมงอาจมีค่าธรรมเนียมการยกเลิก ติดต่อเราผ่าน WhatsApp เพื่อยกเลิก"
        },
        {
          heading: "5. ความรับผิดชอบของผู้โดยสาร",
          text: "ผู้โดยสารต้องให้ข้อมูลจุดรับที่ถูกต้อง รวมถึงหมายเลขเที่ยวบินสำหรับการรับที่สนามบิน ผู้โดยสารรับผิดชอบทรัพย์สินส่วนตัวระหว่างและหลังการเดินทาง"
        },
        {
          heading: "6. การชำระเงิน",
          text: "ชำระเงินให้คนขับโดยตรงหลังเดินทางเสร็จ เรารับเงินสดบาทไทย สามารถจัดเตรียมวิธีชำระเงินอื่นได้ล่วงหน้า"
        },
        {
          heading: "7. ข้อจำกัดความรับผิด",
          text: "แม้เราพยายามให้บริการที่ดีที่สุด เราไม่รับผิดชอบต่อความล่าช้าที่เกิดจากสภาพจราจร สภาพอากาศ หรือสถานการณ์ที่อยู่นอกเหนือการควบคุม เรามีประกันภัยครอบคลุมสำหรับผู้โดยสารทุกคน"
        },
      ]
    },
    privacy: {
      title: "นโยบายความเป็นส่วนตัว",
      lastUpdated: "อัปเดตล่าสุด: พฤษภาคม 2569",
      sections: [
        {
          heading: "1. ข้อมูลที่เราเก็บรวบรวม",
          text: "เราเก็บเฉพาะข้อมูลที่จำเป็นต่อการให้บริการ: ชื่อ เบอร์โทร อีเมล (ไม่บังคับ) จุดรับ/ส่ง วันเดินทาง และคำขอพิเศษ"
        },
        {
          heading: "2. การใช้ข้อมูลของคุณ",
          text: "ข้อมูลของคุณใช้เพื่อจัดการและดำเนินการจองเท่านั้น สื่อสารเรื่องการจอง และปรับปรุงบริการของเรา"
        },
        {
          heading: "3. การแบ่งปันข้อมูล",
          text: "เราไม่ขาย แลกเปลี่ยน หรือให้เช่าข้อมูลส่วนบุคคลแก่บุคคลที่สาม รายละเอียดการจองจะแบ่งปันเฉพาะกับคนขับที่ได้รับมอบหมาย"
        },
        {
          heading: "4. ความปลอดภัยของข้อมูล",
          text: "เราใช้มาตรการที่เหมาะสมในการปกป้องข้อมูลส่วนบุคคล การสื่อสารผ่าน WhatsApp ได้รับการเข้ารหัสแบบ end-to-end"
        },
        {
          heading: "5. คุกกี้",
          text: "เว็บไซต์ใช้คุกกี้น้อยที่สุดสำหรับการตั้งค่าภาษาและฟังก์ชันพื้นฐาน เราไม่ใช้คุกกี้ติดตามหรือแชร์ข้อมูลกับเครือข่ายโฆษณา"
        },
        {
          heading: "6. ติดต่อ",
          text: "หากมีคำถามเกี่ยวกับนโยบายเหล่านี้หรือข้อมูลส่วนบุคคล กรุณาติดต่อเราผ่าน WhatsApp ที่ +66 82 982 4986"
        },
      ]
    }
  }
};

export default function Legal() {
  const { lang } = useLanguage();
  const t = content[lang];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-gradient-to-b from-[var(--color-midnight)] to-background border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link href="/">
            <motion.a
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 cursor-pointer"
              whileHover={{ x: -4 }}
            >
              <ArrowLeft className="w-4 h-4" /> {t.backHome}
            </motion.a>
          </Link>
        </div>
      </div>

      {/* Terms of Service */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-6 py-12"
      >
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-serif font-bold">{t.terms.title}</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8">{t.terms.lastUpdated}</p>

        <div className="space-y-6">
          {t.terms.sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-lg font-semibold mb-2">{section.heading}</h2>
              <p className="text-muted-foreground leading-relaxed">{section.text}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <hr className="border-border" />
      </div>

      {/* Privacy Policy */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-4xl mx-auto px-6 py-12"
      >
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-serif font-bold">{t.privacy.title}</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8">{t.privacy.lastUpdated}</p>

        <div className="space-y-6">
          {t.privacy.sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-lg font-semibold mb-2">{section.heading}</h2>
              <p className="text-muted-foreground leading-relaxed">{section.text}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <div className="max-w-4xl mx-auto px-6 pb-12 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} BKK Pattaya Private Taxi. All rights reserved.
        </p>
      </div>
    </div>
  );
}
