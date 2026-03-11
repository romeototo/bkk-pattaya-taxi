import { appendBookingToSheet } from "./googleSheets";
import { sendTelegramNotification, formatBookingForTelegram } from "./telegram";
import { sendLineNotification, formatBookingForLine } from "./line";
import {
  sendBookingConfirmationEmail,
  sendAdminNotificationEmail,
} from "./email";

export type BookingData = {
  fullName: string;
  phone: string;
  email: string;
  pickupLocation: string;
  dropoffLocation: string;
  travelDate: string;
  travelTime: string;
  passengers: number;
  luggage: number;
  preferredContactMethod: string;
  notes?: string;
  createdAt: Date;
};

export async function notifyNewBooking(
  booking: BookingData,
  adminEmail: string,
  lineUserId?: string
) {
  const results = {
    googleSheets: false,
    telegram: false,
    line: false,
    confirmationEmail: false,
    adminEmail: false,
  };

  try {
    // Send to Google Sheets
    const sheetsResult = await appendBookingToSheet(booking);
    results.googleSheets = sheetsResult.success;

    // Send Telegram notification
    const telegramMessage = formatBookingForTelegram(booking);
    const telegramResult = await sendTelegramNotification(telegramMessage);
    results.telegram = telegramResult.success;

    // Send LINE notification (if user ID provided)
    if (lineUserId) {
      const lineMessage = formatBookingForLine(booking);
      const lineResult = await sendLineNotification(lineUserId, lineMessage);
      results.line = lineResult.success;
    }

    // Send confirmation email to customer
    const confirmResult = await sendBookingConfirmationEmail(
      booking.email,
      booking
    );
    results.confirmationEmail = confirmResult.success;

    // Send admin notification email
    const adminResult = await sendAdminNotificationEmail(adminEmail, booking);
    results.adminEmail = adminResult.success;

    console.log("[NotificationService] Booking notifications sent:", results);
    return results;
  } catch (error) {
    console.error("[NotificationService] Error sending notifications:", error);
    return results;
  }
}
