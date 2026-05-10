import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LocationSelect } from "@/components/LocationSelect";
import { useLanguage } from "@/contexts/LanguageContext";
import { WHATSAPP_URL, fadeInUp, stagger } from "@/config/constants";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Calendar, Clock, Car, CheckCircle2, AlertCircle } from "lucide-react";

export function BookingSection() {
  const { t, lang } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    pickupLocation: "",
    dropoffLocation: "",
    travelDate: "",
    travelTime: "",
    flightNumber: "",
    passengers: "2",
    luggage: "2",
    preferredContactMethod: "whatsapp",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const isAirportPickup = /airport|\bBKK\b|\bDMK\b|\bUTP\b/i.test(formData.pickupLocation);

  // Validation logic
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = lang === "th" ? "กรุณากรอกชื่อ" : "Name is required";
    if (!formData.phone.trim()) newErrors.phone = lang === "th" ? "กรุณากรอกเบอร์โทร" : "Phone is required";
    if (!formData.pickupLocation.trim()) newErrors.pickupLocation = lang === "th" ? "กรุณาเลือกจุดรับ" : "Pickup location is required";
    if (!formData.dropoffLocation.trim()) newErrors.dropoffLocation = lang === "th" ? "กรุณาเลือกจุดส่ง" : "Drop-off location is required";
    if (!formData.travelDate) newErrors.travelDate = lang === "th" ? "กรุณาเลือกวันเดินทาง" : "Travel date is required";
    if (!formData.travelTime) newErrors.travelTime = lang === "th" ? "กรุณาเลือกเวลา" : "Travel time is required";
    return newErrors;
  }, [formData, lang]);

  const isFormValid = useMemo(() => {
    return Object.keys(validateForm()).length === 0;
  }, [validateForm]);

  // Dynamic price calculation
  const calculatedPrice = useMemo(() => {
    // Default fallback
    if (!formData.pickupLocation || !formData.dropoffLocation) return "฿1,500";
    
    // Simple mock logic for demonstration. In a real app, you'd match exact routes.
    const isBKK = formData.pickupLocation.includes("BKK") || formData.pickupLocation.includes("Suvarnabhumi");
    const isPattaya = formData.dropoffLocation.includes("Pattaya");
    
    if (isBKK && isPattaya) return "฿1,500";
    if (formData.pickupLocation.includes("DMK")) return "฿1,800";
    if (formData.pickupLocation.includes("Hua Hin")) return "฿2,500";
    
    return "฿1,500+"; // Baseline
  }, [formData.pickupLocation, formData.dropoffLocation]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Mark all fields as touched
    setTouched({ fullName: true, phone: true, pickupLocation: true, dropoffLocation: true, travelDate: true, travelTime: true });

    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      toast.error(lang === "th" ? "กรุณากรอกข้อมูลให้ครบ" : "Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    const bookingNotes = [
      formData.flightNumber ? `Flight number: ${formData.flightNumber}` : "",
      formData.notes,
    ].filter(Boolean).join("\n");

    const msg = encodeURIComponent(
      `Hello! I'd like to book a transfer:\n\n` +
      `Name: ${formData.fullName}\n` +
      `Phone: ${formData.phone}\n` +
      `Email: ${formData.email}\n` +
      `From: ${formData.pickupLocation}\n` +
      `To: ${formData.dropoffLocation}\n` +
      `Date: ${formData.travelDate}\n` +
      `Time: ${formData.travelTime}\n` +
      `Passengers: ${formData.passengers}\n` +
      `Luggage: ${formData.luggage}\n` +
      `${bookingNotes ? `Notes: ${bookingNotes}` : ""}`
    );

    toast.success(t.booking.success);
    window.open(`${WHATSAPP_URL}?text=${msg}`, "_blank");

    setIsSubmitting(false);
  };

  // Helper for field error display
  const FieldError = ({ field }: { field: string }) => {
    if (!touched[field] || !errors[field]) return null;
    return <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors[field]}</p>;
  };

  const fieldClass = (field: string) =>
    `bg-background/50 border-border ${touched[field] && errors[field] ? 'border-red-500 ring-1 ring-red-500/30' : ''}`;

  return (
    <section id="booking" className="py-20 lg:py-28 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="container relative">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="text-center mb-16">
          <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-serif font-bold mb-4">{t.booking.title}</motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto">{t.booking.subtitle}</motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-8">
            <Card className="glass-card shadow-xl border-primary/10">
              <CardContent className="p-6 lg:p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Route Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-serif font-semibold border-b border-border pb-2 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" /> {t.booking.routeDetails}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">{t.booking.pickup} <span className="text-red-400">*</span></label>
                        <LocationSelect value={formData.pickupLocation} onChange={(val) => { setFormData({ ...formData, pickupLocation: val }); setTouched(p => ({...p, pickupLocation: true})); }} placeholder={t.booking.placeholders.pickup} className={fieldClass('pickupLocation')} />
                        <FieldError field="pickupLocation" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">{t.booking.dropoff} <span className="text-red-400">*</span></label>
                        <LocationSelect value={formData.dropoffLocation} onChange={(val) => { setFormData({ ...formData, dropoffLocation: val }); setTouched(p => ({...p, dropoffLocation: true})); }} placeholder={t.booking.placeholders.dropoff} className={fieldClass('dropoffLocation')} />
                        <FieldError field="dropoffLocation" />
                      </div>
                    </div>
                  </div>

                  {/* Travel Schedule */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-serif font-semibold border-b border-border pb-2 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" /> {t.booking.scheduleVehicle}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">{t.booking.date} <span className="text-red-400">*</span></label>
                        <Input type="date" value={formData.travelDate} onChange={(e) => { setFormData({ ...formData, travelDate: e.target.value }); setTouched(p => ({...p, travelDate: true})); }} min={new Date().toISOString().split("T")[0]} className={`text-foreground [color-scheme:dark] ${fieldClass('travelDate')}`} required />
                        <FieldError field="travelDate" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">{t.booking.time} <span className="text-red-400">*</span></label>
                        <Input type="time" value={formData.travelTime} onChange={(e) => { setFormData({ ...formData, travelTime: e.target.value }); setTouched(p => ({...p, travelTime: true})); }} className={`text-foreground [color-scheme:dark] ${fieldClass('travelTime')}`} required />
                        <FieldError field="travelTime" />
                      </div>
                    </div>
                    {isAirportPickup && (
                      <div className="animate-in fade-in slide-in-from-top-2">
                        <label className="text-sm font-medium text-foreground mb-2 block">{t.booking.flightNumber}</label>
                        <Input placeholder={t.booking.placeholders.flightNumber} value={formData.flightNumber} onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })} className="bg-background/50 border-border" />
                      </div>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                      <div className="col-span-2 md:col-span-2">
                        <label className="text-sm font-medium text-foreground mb-2 block">{t.booking.passengers}</label>
                        <Input type="number" min="1" max="15" value={formData.passengers} onChange={(e) => setFormData({ ...formData, passengers: e.target.value })} className="bg-background/50 border-border" required />
                      </div>
                      <div className="col-span-2 md:col-span-2">
                        <label className="text-sm font-medium text-foreground mb-2 block">{t.booking.luggage}</label>
                        <Input type="number" min="0" max="20" value={formData.luggage} onChange={(e) => setFormData({ ...formData, luggage: e.target.value })} className="bg-background/50 border-border" required />
                      </div>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-serif font-semibold border-b border-border pb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary" /> {t.booking.contactSection}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">{t.booking.fullName} <span className="text-red-400">*</span></label>
                        <Input placeholder={t.booking.placeholders.fullName} value={formData.fullName} onChange={(e) => { setFormData({ ...formData, fullName: e.target.value }); setTouched(p => ({...p, fullName: true})); }} className={fieldClass('fullName')} required />
                        <FieldError field="fullName" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">{t.booking.email}</label>
                        <Input type="email" placeholder={t.booking.placeholders.email} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="bg-background/50 border-border" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">{t.booking.phone} <span className="text-red-400">*</span></label>
                        <Input placeholder={t.booking.placeholders.phone} value={formData.phone} onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); setTouched(p => ({...p, phone: true})); }} className={fieldClass('phone')} required />
                        <FieldError field="phone" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">{t.booking.contactMethod}</label>
                        <Select value={formData.preferredContactMethod} onValueChange={(val) => setFormData({ ...formData, preferredContactMethod: val as any })}>
                          <SelectTrigger className="bg-background/50 border-border"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            <SelectItem value="line">LINE</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">{t.booking.notes}</label>
                    <Textarea placeholder={t.booking.placeholders.notes} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="bg-background/50 border-border min-h-20" />
                  </div>

                  {/* Mobile Submit Button (hidden on desktop, summary card takes over) */}
                  <div className="lg:hidden mt-6">
                    <Button type="submit" size="lg" className={`w-full text-white text-base py-6 shadow-lg transition-all ${isFormValid ? 'bg-whatsapp hover:opacity-90 shadow-green-500/25' : 'bg-muted-foreground/40'}`} disabled={isSubmitting}>
                      {isSubmitting ? (lang === "th" ? "กำลังดำเนินการ..." : "Processing...") : t.booking.confirmBtn}
                      {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2" />}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column: Booking Summary Card */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-4 sticky top-24">
            <Card className="glass-card shadow-2xl border-primary/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              <CardHeader className="bg-primary/5 border-b border-border/50 pb-4">
                <CardTitle className="font-serif text-xl flex items-center gap-2">
                  {t.booking.bookingSummary}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                
                {/* Details List */}
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-muted-foreground whitespace-nowrap">{t.booking.route}</span>
                    <span className="font-medium text-right">
                      {formData.pickupLocation || "---"} <br/>
                      <span className="text-muted-foreground text-xs">→</span> <br/>
                      {formData.dropoffLocation || "---"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-muted-foreground">{t.booking.dateTime}</span>
                    <span className="font-medium">
                      {formData.travelDate ? `${formData.travelDate}` : "---"}
                      {formData.travelTime ? `, ${formData.travelTime}` : ""}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-muted-foreground">{t.booking.passengers}</span>
                    <span className="font-medium">{formData.passengers} {t.booking.pax}</span>
                  </div>
                </div>

                <div className="h-px bg-border/50 my-4" />

                {/* Price Display */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t.booking.estimatedTotal}</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-primary">{calculatedPrice}</span>
                    <span className="text-sm text-muted-foreground mb-1 pb-1 text-decoration-line-through opacity-60">฿2,000</span>
                  </div>
                  <p className="text-xs gradient-gold-text mt-2 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[oklch(0.85_0.12_85)]" /> {t.booking.fixedPrice}
                  </p>
                </div>

                <Button 
                  onClick={() => handleSubmit()} 
                  size="lg" 
                  className={`w-full text-white text-base py-6 mt-4 shadow-xl group border-0 transition-all ${isFormValid ? 'bg-whatsapp hover:opacity-90 shadow-green-500/30' : 'bg-muted-foreground/50 cursor-not-allowed'}`} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      {lang === "th" ? "กำลังดำเนินการ..." : "Processing..."}  
                    </span>
                  ) : (
                    <>{t.booking.bookBtn} <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  {t.booking.noCard}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
