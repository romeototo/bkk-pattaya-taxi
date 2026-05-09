import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { createAdminSessionCookie } from "./_core/adminSession";

// Mock database helpers
vi.mock("./db", () => ({
  createBooking: vi.fn().mockResolvedValue([{ insertId: 1 }]),
  getBookings: vi.fn().mockResolvedValue([
    {
      id: 1,
      pickupLocation: "Suvarnabhumi Airport",
      dropoffLocation: "Pattaya City",
      date: "2026-03-15",
      time: "14:00",
      passengers: 2,
      luggage: 2,
      contact: "+66 81 234 5678",
      contactMethod: "whatsapp",
      notes: null,
      status: "pending",
      createdAt: new Date("2026-03-11T10:00:00Z"),
      updatedAt: new Date("2026-03-11T10:00:00Z"),
    },
  ]),
  getBookingById: vi.fn().mockResolvedValue({
    id: 1,
    pickupLocation: "Suvarnabhumi Airport",
    dropoffLocation: "Pattaya City",
    date: "2026-03-15",
    time: "14:00",
    passengers: 2,
    luggage: 2,
    contact: "+66 81 234 5678",
    contactMethod: "whatsapp",
    notes: null,
    status: "confirmed",
    createdAt: new Date("2026-03-11T10:00:00Z"),
    updatedAt: new Date("2026-03-11T10:00:00Z"),
  }),
  updateBookingStatus: vi.fn().mockResolvedValue({
    id: 1,
    status: "confirmed",
  }),
  getBookingStats: vi.fn().mockResolvedValue({
    total: 10,
    pending: 3,
    confirmed: 4,
    completed: 2,
    cancelled: 1,
    today: 2,
  }),
  searchBookings: vi.fn().mockResolvedValue([]),
  getNotificationSettings: vi.fn(),
  updateAdminNotificationChannels: vi.fn(),
  updateUserNotificationPreferences: vi.fn(),
  verifyAdminPassword: vi.fn().mockResolvedValue({ id: 1, username: "admin", email: "admin@example.com" }),
  sendTelegramNotification: vi.fn().mockResolvedValue(true),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
}));

// Mock notification
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// Mock LLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    id: "test-id",
    created: Date.now(),
    model: "gemini-2.5-flash",
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: "The price from Suvarnabhumi Airport to Pattaya starts from ฿1,100.",
        },
        finish_reason: "stop",
      },
    ],
  }),
}));

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@example.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
      cookies: {
        admin_session: createAdminSessionCookie({ id: 1, username: "admin" }),
      },
    } as unknown as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("admin.bookings", () => {
  it("list returns all bookings for admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.bookings.list({});
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("stats returns booking statistics for admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const stats = await caller.admin.bookings.stats();
    expect(stats).toMatchObject({
      total: expect.any(Number),
      pending: expect.any(Number),
      confirmed: expect.any(Number),
      completed: expect.any(Number),
      cancelled: expect.any(Number),
    });
  });

  it("updateStatus updates booking to confirmed", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.bookings.updateStatus({ id: 1, status: "confirmed" });
    expect(result.success).toBe(true);
  });

  it("getById returns booking for admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const booking = await caller.admin.bookings.getById({ id: 1 });
    expect(booking).toBeDefined();
    expect(booking?.id).toBe(1);
  });

  it("throws FORBIDDEN for non-admin user", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.bookings.stats()).rejects.toThrow();
  });
});

describe("chatbot.chat", () => {
  it("returns a reply from the AI assistant", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.chatbot.chat({
      message: "How much from airport to Pattaya?",
    });
    expect(result.message).toBeTruthy();
    expect(typeof result.message).toBe("string");
  });

  it("handles multi-turn conversation", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.chatbot.chat({
      message: "What is the price?",
      conversationHistory: [
        { role: "user", content: "What routes do you offer?" },
        { role: "assistant", content: "We offer Bangkok to Pattaya and airport transfers." },
      ],
    });
    expect(result.message).toBeTruthy();
  });
});
