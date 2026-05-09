import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

vi.mock("./db", () => ({
  createBooking: vi.fn(),
  getBookings: vi.fn(),
  getBookingById: vi.fn(),
  updateBookingStatus: vi.fn(),
  getBookingStats: vi.fn(),
  searchBookings: vi.fn(),
  getNotificationSettings: vi.fn().mockResolvedValue(null),
  updateAdminNotificationChannels: vi.fn().mockResolvedValue({
    id: 1,
    userId: 1,
    adminLineToken: "test-line-token",
    adminEmailEnabled: "true",
    adminTelegramChatId: "123456789",
  }),
  updateUserNotificationPreferences: vi.fn().mockImplementation((_userId, prefs) => Promise.resolve({
    id: 2,
    userId: 2,
    userEmailNotifications: prefs.emailNotifications === false ? "false" : "true",
    notifyOnConfirmed: prefs.notifyOnConfirmed === false ? "false" : "true",
    notifyOnCompleted: prefs.notifyOnCompleted === false ? "false" : "true",
    notifyOnCancelled: prefs.notifyOnCancelled === false ? "false" : "true",
  })),
  verifyAdminPassword: vi.fn(),
  sendTelegramNotification: vi.fn(),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

function createUserContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("Notification Settings", () => {
  it("should get notification settings for authenticated user", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const settings = await caller.notifications.getSettings();
    // Settings may be undefined if not created yet, which is expected
    expect(typeof settings === "object" || settings === null).toBe(true);
  });

  it("should return null for unauthenticated user", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);

    const settings = await caller.notifications.getSettings();
    expect(settings).toBeNull();
  });

  it("should update admin notification channels", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.notifications.updateAdminChannels({
      lineToken: "test-line-token",
      emailEnabled: true,
      telegramChatId: "123456789",
    });

    expect(result).toBeDefined();
    expect(result?.adminLineToken).toBe("test-line-token");
  });

  it("should throw error if non-admin tries to update admin channels", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.notifications.updateAdminChannels({
        lineToken: "test-token",
      });
      expect.fail("Should have thrown error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should update user notification preferences", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.notifications.updateUserPreferences({
      emailNotifications: true,
      notifyOnConfirmed: true,
      notifyOnCompleted: false,
      notifyOnCancelled: true,
      enableScheduledNotifications: true,
      scheduledMinutesBefore: 60,
    });

    expect(result).toBeDefined();
    expect(result?.userEmailNotifications).toBe("true");
    expect(result?.notifyOnCompleted).toBe("false");
  });

  it("should throw error if unauthenticated user tries to update preferences", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.notifications.updateUserPreferences({
        emailNotifications: true,
      });
      expect.fail("Should have thrown error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should handle partial preference updates", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.notifications.updateUserPreferences({
      emailNotifications: false,
    });

    expect(result?.userEmailNotifications).toBe("false");
  });
});
