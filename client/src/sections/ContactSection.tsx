import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { WHATSAPP_URL, LINE_URL, PHONE, fadeInUp, stagger } from "@/config/constants";
import { motion } from "framer-motion";
import { MessageCircle, Phone as PhoneIcon } from "lucide-react";

export function ContactSection() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-20 lg:py-28">
      <div className="container">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
          <div className="grid gap-12 items-center max-w-3xl mx-auto">
            <motion.div variants={fadeInUp} className="space-y-6">
              <div>
                <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-4 text-foreground">{t.contact.title}</h2>
                <p className="text-muted-foreground text-lg">{t.contact.subtitle}</p>
              </div>

              <div className="space-y-4">
                {/* WhatsApp */}
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

                {/* LINE */}
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

                {/* Call */}
                <motion.div variants={fadeInUp}>
                  <a href={`tel:${PHONE.replace(/\s/g, "")}`}>
                    <Card className="glass-card hover:border-primary/40 transition-all duration-300 group">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white flex-shrink-0">
                            <PhoneIcon className="w-7 h-7" />
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
