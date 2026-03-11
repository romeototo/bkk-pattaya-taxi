import { sendTelegramNotification } from "./telegram";
import { sendBookingConfirmationEmail } from "./email";

export type NotificationType = 
  | "new_booking" 
  | "confirmation" 
  | "reminder" 
  | "status_change";

export type NotificationChannel = "email" | "telegram" | "line";

export interface BookingNotificationData {
  bookingId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  travelDate: string;
  travelTime: string;
  passengers: number;
  luggage: number;
  status?: string;
  adminPhone?: string;
  adminEmail?: string;
}

/**
 * Enhanced notification service with 4 notification types
 * - new_booking: Sent when customer makes a new booking
 * - confirmation: Sent when admin confirms the booking
 * - reminder: Sent 1-2 days before travel date
 * - status_change: Sent when booking status changes
 */

export async function sendNewBookingNotification(
  data: BookingNotificationData,
  channels: NotificationChannel[] = ["email", "telegram"]
): Promise<{ success: boolean; results: Record<string, boolean> }> {
  const results: Record<string, boolean> = {};

  // Send to customer via email
  if (channels.includes("email")) {
    try {
      await sendBookingConfirmationEmail(data.customerEmail, {
        fullName: data.customerName,
        phone: data.customerPhone,
        email: data.customerEmail,
        pickupLocation: data.pickupLocation,
        dropoffLocation: data.dropoffLocation,
        travelDate: data.travelDate,
        travelTime: data.travelTime,
        passengers: data.passengers,
        luggage: data.luggage,
        preferredContactMethod: "email",
      });
      results.customer_email = true;
    } catch (error) {
      console.error("Failed to send customer email:", error);
      results.customer_email = false;
    }
  }

  // Send to admin via Telegram
  if (channels.includes("telegram")) {
    try {
      const message = `🚕 NEW BOOKING ALERT\n\nBooking ID: #${data.bookingId}\nCustomer: ${data.customerName}\nPhone: ${data.customerPhone}\nEmail: ${data.customerEmail}\n\n📍 Route: ${data.pickupLocation} → ${data.dropoffLocation}\n📅 Date: ${data.travelDate}\n🕐 Time: ${data.travelTime}\n👥 Passengers: ${data.passengers}\n🎒 Luggage: ${data.luggage}\n\nStatus: PENDING CONFIRMATION`;
      await sendTelegramNotification(message);
      results.admin_telegram = true;
    } catch (error) {
      console.error("Failed to send admin Telegram notification:", error);
      results.admin_telegram = false;
    }
  }

  return {
    success: Object.values(results).some((r) => r),
    results,
  };
}

export async function sendConfirmationNotification(
  data: BookingNotificationData,
  channels: NotificationChannel[] = ["email", "telegram"]
): Promise<{ success: boolean; results: Record<string, boolean> }> {
  const results: Record<string, boolean> = {};

  // Send to customer
  if (channels.includes("email")) {
    try {
      await sendBookingConfirmationEmail(data.customerEmail, {
        fullName: data.customerName,
        phone: data.customerPhone,
        email: data.customerEmail,
        pickupLocation: data.pickupLocation,
        dropoffLocation: data.dropoffLocation,
        travelDate: data.travelDate,
        travelTime: data.travelTime,
        passengers: data.passengers,
        luggage: data.luggage,
        preferredContactMethod: "email",
        notes: "✅ Your booking has been confirmed!",
      });
      results.customer_email = true;
    } catch (error) {
      console.error("Failed to send confirmation email:", error);
      results.customer_email = false;
    }
  }

  // Send to admin
  if (channels.includes("telegram")) {
    try {
      const message = `✅ BOOKING CONFIRMED\n\nBooking #${data.bookingId}\nCustomer: ${data.customerName}\n\n📍 ${data.pickupLocation} → ${data.dropoffLocation}\n📅 ${data.travelDate} at ${data.travelTime}`;
      await sendTelegramNotification(message);
      results.admin_telegram = true;
    } catch (error) {
      console.error("Failed to send confirmation Telegram:", error);
      results.admin_telegram = false;
    }
  }

  return {
    success: Object.values(results).some((r) => r),
    results,
  };
}

export async function sendReminderNotification(
  data: BookingNotificationData,
  channels: NotificationChannel[] = ["email", "telegram"]
): Promise<{ success: boolean; results: Record<string, boolean> }> {
  const results: Record<string, boolean> = {};

  // Send to customer
  if (channels.includes("email")) {
    try {
      await sendBookingConfirmationEmail(data.customerEmail, {
        fullName: data.customerName,
        phone: data.customerPhone,
        email: data.customerEmail,
        pickupLocation: data.pickupLocation,
        dropoffLocation: data.dropoffLocation,
        travelDate: data.travelDate,
        travelTime: data.travelTime,
        passengers: data.passengers,
        luggage: data.luggage,
        preferredContactMethod: "email",
        notes: "🚗 Travel reminder - please be ready 10 minutes early",
      });
      results.customer_email = true;
    } catch (error) {
      console.error("Failed to send reminder email:", error);
      results.customer_email = false;
    }
  }

  // Send to admin
  if (channels.includes("telegram")) {
    try {
      const message = `🚗 TRAVEL REMINDER\n\nBooking #${data.bookingId}\nCustomer: ${data.customerName}\n\n📍 ${data.pickupLocation} → ${data.dropoffLocation}\n📅 ${data.travelDate}\n🕐 ${data.travelTime}`;
      await sendTelegramNotification(message);
      results.admin_telegram = true;
    } catch (error) {
      console.error("Failed to send reminder Telegram:", error);
      results.admin_telegram = false;
    }
  }

  return {
    success: Object.values(results).some((r) => r),
    results,
  };
}

export async function sendStatusChangeNotification(
  data: BookingNotificationData,
  newStatus: string,
  channels: NotificationChannel[] = ["email", "telegram"]
): Promise<{ success: boolean; results: Record<string, boolean> }> {
  const results: Record<string, boolean> = {};

  const statusMessages: Record<string, string> = {
    confirmed: "✅ Your booking has been confirmed!",
    completed: "✔️ Your trip has been completed. Thank you for choosing us!",
    cancelled: "❌ Your booking has been cancelled.",
  };

  const statusMessage = statusMessages[newStatus] || `Status updated to: ${newStatus}`;

  // Send to customer
  if (channels.includes("email")) {
    try {
      await sendBookingConfirmationEmail(data.customerEmail, {
        fullName: data.customerName,
        phone: data.customerPhone,
        email: data.customerEmail,
        pickupLocation: data.pickupLocation,
        dropoffLocation: data.dropoffLocation,
        travelDate: data.travelDate,
        travelTime: data.travelTime,
        passengers: data.passengers,
        luggage: data.luggage,
        preferredContactMethod: "email",
        notes: statusMessage,
      });
      results.customer_email = true;
    } catch (error) {
      console.error("Failed to send status change email:", error);
      results.customer_email = false;
    }
  }

  // Send to admin
  if (channels.includes("telegram")) {
    try {
      const message = `📢 BOOKING STATUS UPDATE\n\nBooking #${data.bookingId}\nCustomer: ${data.customerName}\nNew Status: ${newStatus.toUpperCase()}\n\n${statusMessage}`;
      await sendTelegramNotification(message);
      results.admin_telegram = true;
    } catch (error) {
      console.error("Failed to send status change Telegram:", error);
      results.admin_telegram = false;
    }
  }

  return {
    success: Object.values(results).some((r) => r),
    results,
  };
}
