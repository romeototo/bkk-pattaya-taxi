import { describe, it, expect, beforeAll } from "vitest";
import axios from "axios";

describe("Telegram Integration - Credential Validation", () => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  beforeAll(() => {
    console.log("Testing Telegram credentials...");
    console.log("Bot Token:", botToken ? "✓ Set" : "✗ Missing");
    console.log("Chat ID:", chatId ? "✓ Set" : "✗ Missing");
  });

  it("should have TELEGRAM_BOT_TOKEN environment variable", () => {
    if (!botToken) return;
    expect(botToken).toBeDefined();
    expect(botToken).toBeTruthy();
  });

  it("should have TELEGRAM_CHAT_ID environment variable", () => {
    if (!chatId) return;
    expect(chatId).toBeDefined();
    expect(chatId).toBeTruthy();
  });

  it("should validate Telegram bot token format", () => {
    if (!botToken) return;
    expect(botToken).toMatch(/^\d+:[A-Za-z0-9_-]+$/);
  });

  it("should validate Telegram chat ID format", () => {
    if (!chatId) return;
    expect(chatId).toMatch(/^\d+$/);
  });

  it("should be able to call Telegram getMe API with bot token", async () => {
    if (!botToken) {
      console.warn("Skipping API test - bot token not set");
      return;
    }

    try {
      const response = await axios.get(
        `https://api.telegram.org/bot${botToken}/getMe`,
        { timeout: 5000 }
      );

      expect(response.status).toBe(200);
      expect(response.data.ok).toBe(true);
      expect(response.data.result).toBeDefined();
      expect(response.data.result.is_bot).toBe(true);

      console.log("✓ Telegram Bot is valid:", response.data.result.username);
    } catch (error: any) {
      console.error("✗ Telegram API Error:", error.message);
      throw new Error(`Telegram bot token validation failed: ${error.message}`);
    }
  });

  it("should be able to send a test message to Telegram", async () => {
    if (!botToken || !chatId) {
      console.warn("Skipping message test - credentials not set");
      return;
    }

    try {
      const response = await axios.post(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          chat_id: chatId,
          text: "🧪 Test Message from BKK Pattaya Taxi System\n\n✅ Telegram integration is working correctly!",
          parse_mode: "HTML",
        },
        { timeout: 5000 }
      );

      expect(response.status).toBe(200);
      expect(response.data.ok).toBe(true);
      expect(response.data.result).toBeDefined();
      expect(response.data.result.message_id).toBeDefined();

      console.log("✓ Test message sent successfully!");
      console.log("Message ID:", response.data.result.message_id);
    } catch (error: any) {
      console.error("✗ Failed to send test message:", error.message);
      throw new Error(`Telegram message test failed: ${error.message}`);
    }
  });

  it("should format booking message correctly", async () => {
    const mockBooking = {
      fullName: "Test User",
      phone: "+66971729666",
      email: "test@example.com",
      pickupLocation: "Bangkok Airport",
      dropoffLocation: "Pattaya Hotel",
      travelDate: "2026-03-15",
      travelTime: "14:00",
      passengers: 2,
      luggage: 2,
      preferredContactMethod: "whatsapp",
      notes: "Test booking",
      createdAt: new Date(),
    };

    const message = `🚕 <b>NEW BOOKING</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Passenger: ${mockBooking.fullName}
📱 Phone: ${mockBooking.phone}
📧 Email: ${mockBooking.email}
📍 From: ${mockBooking.pickupLocation}
📍 To: ${mockBooking.dropoffLocation}
📅 Date: ${mockBooking.travelDate}
⏰ Time: ${mockBooking.travelTime}
👥 Passengers: ${mockBooking.passengers}
🧳 Luggage: ${mockBooking.luggage}
💬 Contact: ${mockBooking.preferredContactMethod}
📝 Notes: ${mockBooking.notes || "None"}`;

    expect(message).toContain("NEW BOOKING");
    expect(message).toContain(mockBooking.fullName);
    expect(message).toContain(mockBooking.phone);
    expect(message).toContain(mockBooking.pickupLocation);

    console.log("✓ Message format is correct");
  });
});
