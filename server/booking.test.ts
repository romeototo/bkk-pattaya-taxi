import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database module
vi.mock("./db", () => ({
  createBooking: vi.fn().mockResolvedValue([{ insertId: 1 }]),
  getBookings: vi.fn().mockResolvedValue([]),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
  getDb: vi.fn(),
}));

// Mock the notification module
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("booking.create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a booking with valid input", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.booking.create({
      fullName: "John Doe",
      phone: "+66971729666",
      email: "john@example.com",
      pickupLocation: "Suvarnabhumi Airport",
      dropoffLocation: "Hilton Pattaya",
      travelDate: "2025-04-15",
      travelTime: "14:00",
      passengers: 2,
      luggage: 2,
      preferredContactMethod: "whatsapp",
      notes: "Need child seat",
    });

    expect(result).toEqual({ success: true, bookingId: 1 });
  });

  it("creates a booking without optional notes", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.booking.create({
      fullName: "Jane Smith",
      phone: "+66987654321",
      email: "jane@example.com",
      pickupLocation: "Bangkok City Center",
      dropoffLocation: "Pattaya Walking Street",
      travelDate: "2025-05-01",
      travelTime: "09:00",
      passengers: 4,
      luggage: 3,
      preferredContactMethod: "email",
    });

    expect(result).toEqual({ success: true, bookingId: 1 });
  });

  it("rejects booking with missing full name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.booking.create({
        fullName: "",
        phone: "+66971729666",
        email: "test@example.com",
        pickupLocation: "Bangkok",
        dropoffLocation: "Pattaya",
        travelDate: "2025-04-15",
        travelTime: "14:00",
        passengers: 2,
        luggage: 2,
        preferredContactMethod: "whatsapp",
      })
    ).rejects.toThrow();
  });

  it("rejects booking with invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.booking.create({
        fullName: "John Doe",
        phone: "+66971729666",
        email: "invalid-email",
        pickupLocation: "Bangkok",
        dropoffLocation: "Pattaya",
        travelDate: "2025-04-15",
        travelTime: "14:00",
        passengers: 2,
        luggage: 2,
        preferredContactMethod: "whatsapp",
      })
    ).rejects.toThrow();
  });

  it("rejects booking with invalid passenger count", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.booking.create({
        fullName: "John Doe",
        phone: "+66971729666",
        email: "john@example.com",
        pickupLocation: "Bangkok",
        dropoffLocation: "Pattaya",
        travelDate: "2025-04-15",
        travelTime: "14:00",
        passengers: 0,
        luggage: 2,
        preferredContactMethod: "whatsapp",
      })
    ).rejects.toThrow();
  });

  it("rejects booking with invalid contact method", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.booking.create({
        fullName: "John Doe",
        phone: "+66971729666",
        email: "john@example.com",
        pickupLocation: "Bangkok",
        dropoffLocation: "Pattaya",
        travelDate: "2025-04-15",
        travelTime: "14:00",
        passengers: 2,
        luggage: 2,
        preferredContactMethod: "invalid" as any,
      })
    ).rejects.toThrow();
  });
});

describe("booking.list", () => {
  it("returns an array of bookings", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.booking.list();
    expect(Array.isArray(result)).toBe(true);
  });
});
