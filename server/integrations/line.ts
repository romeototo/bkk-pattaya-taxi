import axios from "axios";
import { ENV } from "../_core/env";

const LINE_API_URL = "https://api.line.biz/v1/bot/message/push";

export async function sendLineNotification(userId: string, message: string) {
  try {
    if (!ENV.lineChannelAccessToken) {
      console.warn("[LINE] Channel access token not configured");
      return { success: false, error: "LINE not configured" };
    }

    const response = await axios.post(
      LINE_API_URL,
      {
        to: userId,
        messages: [
          {
            type: "text",
            text: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${ENV.lineChannelAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("[LINE] Message sent successfully");
    return { success: true };
  } catch (error) {
    console.error("[LINE] Error sending message:", error);
    return { success: false, error: String(error) };
  }
}

export function formatBookingForLine(booking: {
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
🚕 New Booking Received

Passenger Details:
Name: ${booking.fullName}
Phone: ${booking.phone}
Email: ${booking.email}

Trip Details:
Pickup: ${booking.pickupLocation}
Dropoff: ${booking.dropoffLocation}
Date: ${booking.travelDate}
Time: ${booking.travelTime}
Passengers: ${booking.passengers}
Luggage: ${booking.luggage}

Contact Method: ${booking.preferredContactMethod}
${booking.notes ? `Notes: ${booking.notes}` : ""}

Please confirm or reject this booking
  `.trim();
}
