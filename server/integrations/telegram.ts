import axios from "axios";
import { ENV } from "../_core/env";

export async function sendTelegramNotification(message: string) {
  try {
    if (!ENV.telegramBotToken || !ENV.telegramChatId) {
      console.warn("[Telegram] Bot token or chat ID not configured");
      return { success: false, error: "Telegram not configured" };
    }

    const url = `https://api.telegram.org/bot${ENV.telegramBotToken}/sendMessage`;

    const response = await axios.post(url, {
      chat_id: ENV.telegramChatId,
      text: message,
      parse_mode: "HTML",
    });

    console.log("[Telegram] Message sent successfully");
    return { success: true, messageId: response.data.result.message_id };
  } catch (error) {
    console.error("[Telegram] Error sending message:", error);
    return { success: false, error: String(error) };
  }
}

export function formatBookingForTelegram(booking: {
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
}): string {
  return `
<b>🚕 New Booking Received</b>

<b>Passenger Details:</b>
• Name: ${booking.fullName}
• Phone: ${booking.phone}
• Email: ${booking.email}

<b>Trip Details:</b>
• Pickup: ${booking.pickupLocation}
• Dropoff: ${booking.dropoffLocation}
• Date: ${booking.travelDate}
• Time: ${booking.travelTime}
• Passengers: ${booking.passengers}
• Luggage: ${booking.luggage}

<b>Contact Method:</b> ${booking.preferredContactMethod}
${booking.notes ? `<b>Notes:</b> ${booking.notes}` : ""}

<i>Please confirm or reject this booking</i>
  `.trim();
}
