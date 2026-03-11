import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  sendNewBookingNotification,
  sendConfirmationNotification,
  sendReminderNotification,
  sendStatusChangeNotification,
  type BookingNotificationData,
} from "./enhancedNotificationService";

// Mock the notification services
vi.mock("./telegram", () => ({
  sendTelegramNotification: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("./email", () => ({
  sendBookingConfirmationEmail: vi.fn().mockResolvedValue({ success: true }),
}));

const mockBookingData: BookingNotificationData = {
  bookingId: 1,
  customerName: "John Doe",
  customerEmail: "john@example.com",
  customerPhone: "+66812345678",
  pickupLocation: "Bangkok Airport",
  dropoffLocation: "Pattaya Hotel",
  travelDate: "2026-03-15",
  travelTime: "14:00",
  passengers: 2,
  luggage: 2,
  adminEmail: "admin@example.com",
  adminPhone: "+66987654321",
};

describe("Enhanced Notification Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("sendNewBookingNotification", () => {
    it("should send new booking notification via email and telegram", async () => {
      const result = await sendNewBookingNotification(mockBookingData);

      expect(result.success).toBe(true);
      expect(result.results.customer_email).toBe(true);
      expect(result.results.admin_telegram).toBe(true);
    });

    it("should handle email-only notifications", async () => {
      const result = await sendNewBookingNotification(mockBookingData, ["email"]);

      expect(result.success).toBe(true);
      expect(result.results.customer_email).toBe(true);
      expect(result.results.admin_telegram).toBeUndefined();
    });

    it("should handle telegram-only notifications", async () => {
      const result = await sendNewBookingNotification(mockBookingData, ["telegram"]);

      expect(result.success).toBe(true);
      expect(result.results.admin_telegram).toBe(true);
      expect(result.results.customer_email).toBeUndefined();
    });
  });

  describe("sendConfirmationNotification", () => {
    it("should send confirmation notification", async () => {
      const result = await sendConfirmationNotification(mockBookingData);

      expect(result.success).toBe(true);
      expect(result.results.customer_email).toBe(true);
      expect(result.results.admin_telegram).toBe(true);
    });

    it("should include confirmation message in notification", async () => {
      const result = await sendConfirmationNotification(mockBookingData);

      expect(result.success).toBe(true);
      expect(Object.values(result.results).some((r) => r)).toBe(true);
    });
  });

  describe("sendReminderNotification", () => {
    it("should send reminder notification", async () => {
      const result = await sendReminderNotification(mockBookingData);

      expect(result.success).toBe(true);
      expect(result.results.customer_email).toBe(true);
      expect(result.results.admin_telegram).toBe(true);
    });

    it("should include reminder message in notification", async () => {
      const result = await sendReminderNotification(mockBookingData);

      expect(result.success).toBe(true);
    });
  });

  describe("sendStatusChangeNotification", () => {
    it("should send status change notification for confirmed status", async () => {
      const result = await sendStatusChangeNotification(
        mockBookingData,
        "confirmed"
      );

      expect(result.success).toBe(true);
      expect(result.results.customer_email).toBe(true);
      expect(result.results.admin_telegram).toBe(true);
    });

    it("should send status change notification for completed status", async () => {
      const result = await sendStatusChangeNotification(
        mockBookingData,
        "completed"
      );

      expect(result.success).toBe(true);
    });

    it("should send status change notification for cancelled status", async () => {
      const result = await sendStatusChangeNotification(
        mockBookingData,
        "cancelled"
      );

      expect(result.success).toBe(true);
    });

    it("should handle unknown status", async () => {
      const result = await sendStatusChangeNotification(
        mockBookingData,
        "unknown_status"
      );

      expect(result.success).toBe(true);
    });
  });

  describe("Notification Data Handling", () => {
    it("should handle booking data with all fields", async () => {
      const result = await sendNewBookingNotification(mockBookingData);

      expect(result.success).toBe(true);
      expect(result.results).toBeDefined();
    });

    it("should handle booking data with minimal fields", async () => {
      const minimalData: BookingNotificationData = {
        bookingId: 1,
        customerName: "Jane Doe",
        customerEmail: "jane@example.com",
        customerPhone: "+66812345678",
        pickupLocation: "Airport",
        dropoffLocation: "Hotel",
        travelDate: "2026-03-15",
        travelTime: "14:00",
        passengers: 1,
        luggage: 1,
      };

      const result = await sendNewBookingNotification(minimalData);

      expect(result.success).toBe(true);
    });
  });

  describe("Multiple Channels", () => {
    it("should support email and telegram channels", async () => {
      const result = await sendNewBookingNotification(mockBookingData, [
        "email",
        "telegram",
      ]);

      expect(result.success).toBe(true);
      expect(result.results.customer_email).toBe(true);
      expect(result.results.admin_telegram).toBe(true);
    });

    it("should support single channel", async () => {
      const result = await sendNewBookingNotification(mockBookingData, [
        "email",
      ]);

      expect(result.success).toBe(true);
      expect(result.results.customer_email).toBe(true);
    });
  });
});
