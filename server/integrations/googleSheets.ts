import { google } from "googleapis";
import { ENV } from "../_core/env";

const sheets = google.sheets("v4");

// Parse Google Sheets credentials from base64 encoded JSON
function getGoogleAuth() {
  if (!ENV.googleSheetsCredentials) {
    throw new Error("GOOGLE_SHEETS_CREDENTIALS not configured");
  }

  try {
    const credentials = JSON.parse(
      Buffer.from(ENV.googleSheetsCredentials, "base64").toString("utf-8")
    );
    return new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  } catch (error) {
    console.error("Failed to parse Google credentials:", error);
    throw new Error("Invalid GOOGLE_SHEETS_CREDENTIALS format");
  }
}

export async function appendBookingToSheet(booking: {
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
}) {
  try {
    const auth = getGoogleAuth();
    const spreadsheetId = ENV.googleSheetsId;

    if (!spreadsheetId) {
      throw new Error("GOOGLE_SHEETS_ID not configured");
    }

    const values = [
      [
        new Date().toISOString(),
        booking.fullName,
        booking.phone,
        booking.email,
        booking.pickupLocation,
        booking.dropoffLocation,
        booking.travelDate,
        booking.travelTime,
        booking.passengers,
        booking.luggage,
        booking.preferredContactMethod,
        booking.notes || "",
      ],
    ];

    await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "Sheet1!A:L",
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    });

    console.log("[Google Sheets] Booking appended successfully");
    return { success: true };
  } catch (error) {
    console.error("[Google Sheets] Error appending booking:", error);
    return { success: false, error: String(error) };
  }
}
