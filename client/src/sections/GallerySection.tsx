import { useLanguage } from "@/contexts/LanguageContext";
import { galleryImages, fadeInUp, stagger } from "@/config/constants";
import { motion } from "framer-motion";
import { MapPin, Camera } from "lucide-react";

export function GallerySection() {
  const { t } = useLanguage();

  return (
    <section id="gallery" className="py-20 lg:py-28">
      <div className="container">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="text-center mb-16">
          <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-serif font-bold mb-4">{t.gallery.title}</motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto">{t.gallery.subtitle}</motion.p>
        </motion.div>

        {/* Photo Gallery with Overlays */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer ${i === 0 ? "col-span-2 lg:col-span-2 row-span-2" : ""}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover aspect-video group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              {/* Always-visible bottom gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Caption — always visible at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-white/80" />
                  <span className="text-white font-medium text-sm drop-shadow-lg">{img.caption}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Route Map — integrated with heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-foreground">Bangkok → Pattaya Route</h3>
              <p className="text-sm text-muted-foreground">Approximately 1.5 – 2 hours via Motorway 7</p>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-border/50 shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d496058.5!2d100.5!3d13.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e6!4m5!1s0x311d6032280d61f3%3A0x10100b25de24820!2sBangkok!3m2!1d13.7563309!2d100.5017651!4m5!1s0x3102b7e2d5e0f01d%3A0x10100b25de24880!2sPattaya!3m2!1d12.9235557!2d100.8824551!5e0!3m2!1sen!2sth!4v1709000000000!5m2!1sen!2sth"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bangkok to Pattaya route"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
