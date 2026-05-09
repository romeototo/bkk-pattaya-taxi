# 🚕 BKK Pattaya Private Taxi

> เว็บไซต์ Landing Page และระบบจองรถแท็กซี่ส่วนตัว (Private Transfer) ระหว่างกรุงเทพฯ และพัทยา ที่เน้นทำ SEO และมุ่งเน้นเพิ่มยอด Conversion
>
> 🌐 **เว็บไซต์จริง (Live Demo):** [romeototo.github.io/bkk-pattaya-taxi](https://romeototo.github.io/bkk-pattaya-taxi/)
>
> 🇹🇭 [อ่านเป็นภาษาอังกฤษ (English Version)](./README.md)

![Build](https://img.shields.io/badge/Build-Passing-4CAF50?style=flat-square)
![Tech](https://img.shields.io/badge/TypeScript-93.8%25-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Framework](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Backend](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![Database](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## 📸 Screenshots & UI Design
เว็บไซต์ถูกออกแบบมาในธีม **VIP Midnight Blue & Champagne Gold** เพื่อเสริมสร้างภาพลักษณ์ความน่าเชื่อถือ หรูหรา และเป็นมืออาชีพ

| Hero Section (หน้าแรก) | Booking Wizard (ฟอร์มการจอง) |
| :---: | :---: |
| <img src="https://placehold.co/600x400/020817/D5B563?text=Hero+Section+Screenshot" width="100%"> | <img src="https://placehold.co/600x400/020817/D5B563?text=Booking+Form+Screenshot" width="100%"> |

| Why Choose Us (Bento Grid Layout) |
| :---: |
| <img src="https://placehold.co/800x400/020817/D5B563?text=Bento+Grid+UI+Screenshot" width="100%"> |

*(หมายเหตุ: ใส่ภาพ Screenshot ของจริงทับลิงก์ placehold.co ในอนาคต)*

---

## ✨ ฟีเจอร์เด่น (Features)

| หมวดหมู่ | รายละเอียด |
|----------|---------|
| 🎨 **Landing Page** | ออกแบบให้โหลดเร็ว รองรับ SEO และแสดงผลได้ดีบนมือถือ พร้อม Animation ด้วย Framer Motion |
| 📋 **Booking Form** | ฟอร์มจองแบบหลายขั้นตอน (Wizard) พร้อมการตรวจเช็คข้อมูลด้วย Zod และ React Hook Form |
| 🔔 **ระบบแจ้งเตือน** | ยิงข้อมูลเข้า Google Sheets + Telegram + LINE + อีเมล (SMTP) อัตโนมัติ |
| 🛡️ **ระบบหลังบ้าน** | แดชบอร์ดจัดการข้อมูลการจอง ดูสถิติ และระบบล็อกอินแอดมิน |
| 📊 **Analytics** | กราฟสรุปสถิติการใช้งานด้วย Recharts |
| 🌐 **SEO & 2 ภาษา** | รองรับภาษาไทย/อังกฤษ (EN/TH) พร้อมระบบ Meta tags และ Open Graph |

---

## 🏗️ โครงสร้างสถาปัตยกรรม (Architecture)

```mermaid
graph TD
    A["🌐 หน้าเว็บไซต์<br/>(React + Tailwind)"] --> B["📋 ฟอร์มจอง"]
    B --> C["🔀 tRPC Router<br/>(Express Backend)"]
    C --> D["💾 ฐานข้อมูล MySQL<br/>(Drizzle ORM)"]
    C --> E["📢 บริการส่งการแจ้งเตือน"]
    
    E --> F["📊 Google Sheets"]
    E --> G["🤖 Telegram Bot"]
    E --> H["💬 LINE Messaging"]
    E --> I["📧 ส่งอีเมล SMTP"]
    
    J["🔐 ระบบจัดการหลังบ้าน"] --> C
    J --> K["📈 กราฟและสถิติ<br/>(Recharts)"]

    style A fill:#6C63FF,color:#fff
    style C fill:#3178C6,color:#fff
    style D fill:#4479A1,color:#fff
    style E fill:#FF6B35,color:#fff
```

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

### หน้าบ้าน (Frontend)
- **React 19** + TypeScript
- **Tailwind CSS 4** — ตกแต่งเว็บไซต์อย่างรวดเร็ว
- **Radix UI** — Component ยืดหยุ่นและเข้าถึงได้ง่าย (Accessible)
- **Framer Motion** — จัดการ Animation ต่างๆ บนเว็บ
- **React Hook Form** + Zod — ตรวจจับข้อผิดพลาดในฟอร์มอย่างแม่นยำ

### หลังบ้าน (Backend)
- **Express** + TypeScript
- **tRPC** — เชื่อมต่อ API แบบ Type-safe ป้องกันข้อผิดพลาด
- **Drizzle ORM** — จัดการฐานข้อมูลอย่างมีประสิทธิภาพ
- **MySQL/TiDB** — ฐานข้อมูลแบบ Relation

### การเชื่อมต่อกับบริการภายนอก (Integrations)
- **Google Sheets API** — บันทึกข้อมูลคนจองลงตารางอัตโนมัติ
- **Telegram Bot API** — ส่งแจ้งเตือนการจองให้คนขับผ่านกลุ่ม
- **LINE Messaging API** — เชื่อมโยงลูกค้า
- **Nodemailer** — จัดการระบบอีเมลตอบกลับ

---

## 🚀 เริ่มต้นใช้งานโปรเจกต์ (Quick Start)

ดูรายละเอียดการตั้งค่าแบบเจาะลึกได้ที่ [คู่มือการติดตั้ง (SETUP_GUIDE.md)](./SETUP_GUIDE.md)

```bash
# คัดลอกโปรเจกต์
git clone https://github.com/romeototo/bkk-pattaya-taxi.git
cd bkk-pattaya-taxi

# ติดตั้งไลบรารี
pnpm install

# ตั้งค่า Environment Variables
copy .env.example .env

# สร้างฐานข้อมูลและแอดมินคนแรก
pnpm db:push
pnpm admin:create -- --username admin --email owner@example.com --password "เปลี่ยนรหัสผ่านที่นี่"

# เปิดเซิร์ฟเวอร์สำหรับพัฒนา
pnpm dev
```

---

## 📄 ลิขสิทธิ์ (License)

[MIT](./LICENSE) © Romeo T.
