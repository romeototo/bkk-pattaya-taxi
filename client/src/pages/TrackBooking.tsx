import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Search, CheckCircle, Clock, AlertCircle, MapPin, Phone, Calendar, MapPinIcon } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const statusConfig = {
  pending: {
    label: "Pending Confirmation",
    icon: Clock,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  cancelled: {
    label: "Cancelled",
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/20",
  },
};

export function TrackBooking() {
  const [phone, setPhone] = useState("");
  const [bookingCode, setBookingCode] = useState("");
  const [searched, setSearched] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBooking(null);

    if (!phone.trim() || !bookingCode.trim()) {
      setError("Please enter both phone number and booking code");
      return;
    }

    try {
      // For now, show a message that the feature is being set up
      // In production, this would call an API to fetch booking details
      toast.info("Track booking feature coming soon! Please call us at +66 82 982 4986");
      setSearched(true);
    } catch (err) {
      setError("Failed to find booking. Please check your details.");
      toast.error("Error searching for booking");
    }
  };

  const status = booking?.status as keyof typeof statusConfig;
  const statusInfo = status ? statusConfig[status] : null;
  const StatusIcon = statusInfo?.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 py-20">
      <div className="container max-w-2xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-4">
            Track Your Booking
          </h1>
          <p className="text-muted-foreground text-lg">
            Enter your phone number and booking code to check the status of your transfer
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-8"
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search Your Booking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    placeholder="+66 82 982 4986"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-input border-border"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Booking Code
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., BKK-20260315-001"
                    value={bookingCode}
                    onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                    className="bg-input border-border"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search Booking
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {searched && !booking && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center"
          >
            <Card className="glass-card bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <p className="text-blue-700 dark:text-blue-400 mb-4">
                  Track booking feature is coming soon!
                </p>
                <p className="text-muted-foreground mb-6">
                  For now, please contact us directly:
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://wa.me/66829824986"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Chat on WhatsApp
                  </a>
                  <a
                    href="tel:+66829824986"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call +66 82 982 4986
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {booking && statusInfo && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="space-y-6"
          >
            <Card className={`glass-card ${statusInfo.bgColor}`}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-6">
                  {StatusIcon && <StatusIcon className={`w-8 h-8 ${statusInfo.color}`} />}
                  <div>
                    <p className="text-sm text-muted-foreground">Current Status</p>
                    <p className={`text-2xl font-bold ${statusInfo.color}`}>
                      {statusInfo.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date & Time</p>
                      <p className="font-semibold">
                        {new Date(booking.travelDate).toLocaleDateString()} at {booking.travelTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Passenger</p>
                      <p className="font-semibold">{booking.fullName}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Route</p>
                    <p className="font-semibold">{booking.pickupLocation}</p>
                    <div className="flex items-center gap-2 my-2 text-muted-foreground">
                      <div className="h-0.5 flex-1 bg-border" />
                      <MapPinIcon className="w-4 h-4" />
                      <div className="h-0.5 flex-1 bg-border" />
                    </div>
                    <p className="font-semibold">{booking.dropoffLocation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {booking.status === "pending" && (
              <Card className="glass-card bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
                <CardContent className="pt-6">
                  <p className="text-yellow-700 dark:text-yellow-400">
                    Your booking is being reviewed. We will contact you shortly to confirm.
                  </p>
                </CardContent>
              </Card>
            )}

            {booking.status === "confirmed" && (
              <Card className="glass-card bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                <CardContent className="pt-6">
                  <p className="text-green-700 dark:text-green-400 mb-4">
                    Your booking is confirmed! Our driver will pick you up at the scheduled time.
                  </p>
                  <a
                    href="https://wa.me/66829824986"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:underline font-medium"
                  >
                    <Phone className="w-4 h-4" />
                    Contact us on WhatsApp
                  </a>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mt-12 text-center"
        >
          <Card className="glass-card">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
              <p className="text-muted-foreground mb-6">
                Contact us directly for any questions about your booking
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://wa.me/66829824986"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  WhatsApp
                </a>
                <a
                  href="tel:+66829824986"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call Us
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
