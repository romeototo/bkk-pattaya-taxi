import { describe, it, expect, vi, beforeEach } from "vitest";
import { notifyNewBooking, BookingData } from "./notificationService";

// Mock the integration modules
vi.mock("./googleSheets", () => ({
  appendBookingToSheet: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("./telegram", () => ({
  sendTelegramNotification: vi.fn().mockResolvedValue({ success: true }),
  formatBookingForTelegram: vi.fn().mockReturnValue("Telegram message"),
}));

vi.mock("./line", () => ({
  sendLineNotification: vi.fn().mockResolvedValue({ success: true }),
  formatBookingForLine: vi.fn().mockReturnValue("LINE message"),
}));

vi.mock("./email", () => ({
  sendBookingConfirmationEmail: vi.fn().mockResolvedValue({ success: true }),
  sendAdminNotificationEmail: vi.fn().mockResolvedValue({ success: true }),
}));

describe("Notification Service", () => {
  const mockBooking: BookingData = {
    fullName: "John Doe",
    phone: "+66971729666",
    email: "john@example.com",
    pickupLocation: "Bangkok Airport",
    dropoffLocation: "Pattaya Hotel",
    travelDate: "2026-03-15",
    travelTime: "14:00",
    passengers: 2,
    luggage: 2,
    preferredContactMethod: "whatsapp",
    notes: "Please arrive 30 minutes early",
    createdAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should send notifications to all channels", async () => {
    const result = await notifyNewBooking(
      mockBooking,
      "admin@example.com",
      "user123"
    );

    expect(result.googleSheets).toBe(true);
    expect(result.telegram).toBe(true);
    expect(result.line).toBe(true);
    expect(result.confirmationEmail).toBe(true);
    expect(result.adminEmail).toBe(true);
  });

  it("should handle missing LINE user ID gracefully", async () => {
    const result = await notifyNewBooking(
      mockBooking,
      "admin@example.com"
    );

    expect(result.googleSheets).toBe(true);
    expect(result.telegram).toBe(true);
    expect(result.line).toBe(false);
    expect(result.confirmationEmail).toBe(true);
    expect(result.adminEmail).toBe(true);
  });

  it("should return success even if individual channels fail", async () => {
    const { appendBookingToSheet } = await import("./googleSheets");
    vi.mocked(appendBookingToSheet).mockResolvedValueOnce({ success: false });

    const result = await notifyNewBooking(
      mockBooking,
      "admin@example.com",
      "user123"
    );

    expect(result.googleSheets).toBe(false);
    expect(result.telegram).toBe(true);
    expect(result.line).toBe(true);
    expect(result.confirmationEmail).toBe(true);
    expect(result.adminEmail).toBe(true);
  });

  it("should include all booking details in notifications", async () => {
    await notifyNewBooking(mockBooking, "admin@example.com", "user123");

    const { formatBookingForTelegram } = await import("./telegram");
    const { formatBookingForLine } = await import("./line");

    expect(formatBookingForTelegram).toHaveBeenCalledWith(mockBooking);
    expect(formatBookingForLine).toHaveBeenCalledWith(mockBooking);
  });
});
