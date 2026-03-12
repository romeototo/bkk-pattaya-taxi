import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, bookings, InsertBooking, notificationSettings, InsertNotificationSettings } from "../drizzle/schema";
import { ENV } from './_core/env';
import { adminCredentials, InsertAdminCredential } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }

    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    }

    await db
      .insert(users)
      .values(values)
      .onDuplicateKeyUpdate({
        set: updateSet,
      });
  } catch (error) {
    console.error("[Database] Error upserting user:", error);
    throw error;
  }
}

export async function createBooking(data: InsertBooking) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const result = await db.insert(bookings).values(data);
    return result;
  } catch (error) {
    console.error("[Database] Error creating booking:", error);
    throw error;
  }
}

export async function getBookings() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    return await db.select().from(bookings);
  } catch (error) {
    console.error("[Database] Error getting bookings:", error);
    throw error;
  }
}

export async function getBookingById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const result = await db.select().from(bookings).where(eq(bookings.id, id));
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Error getting booking:", error);
    throw error;
  }
}

export async function updateBookingStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.update(bookings).set({ status: status as any }).where(eq(bookings.id, id));
    return getBookingById(id);
  } catch (error) {
    console.error("[Database] Error updating booking:", error);
    throw error;
  }
}

export async function getBookingStats() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const allBookings = await db.select().from(bookings);
    return {
      total: allBookings.length,
      pending: allBookings.filter(b => b.status === "pending").length,
      confirmed: allBookings.filter(b => b.status === "confirmed").length,
      completed: allBookings.filter(b => b.status === "completed").length,
      cancelled: allBookings.filter(b => b.status === "cancelled").length,
    };
  } catch (error) {
    console.error("[Database] Error getting booking stats:", error);
    throw error;
  }
}

export async function searchBookings(query: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const allBookings = await db.select().from(bookings);
    const lowerQuery = query.toLowerCase();
    return allBookings.filter(b =>
      b.fullName.toLowerCase().includes(lowerQuery) ||
      b.phone.includes(query) ||
      b.email.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error("[Database] Error searching bookings:", error);
    throw error;
  }
}

export async function getNotificationSettings(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const settings = await db.select().from(notificationSettings).where(eq(notificationSettings.userId, userId));
    return settings[0] || null;
  } catch (error) {
    console.error("[Database] Error getting notification settings:", error);
    throw error;
  }
}

export async function upsertNotificationSettings(userId: number, settings: Partial<InsertNotificationSettings>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const existing = await getNotificationSettings(userId);
    if (existing) {
      await db.update(notificationSettings).set(settings).where(eq(notificationSettings.userId, userId));
    } else {
      await db.insert(notificationSettings).values({ userId, ...settings });
    }
    return getNotificationSettings(userId);
  } catch (error) {
    console.error("[Database] Error upserting notification settings:", error);
    throw error;
  }
}

export async function updateAdminNotificationChannels(userId: number, channels: { lineToken?: string; emailEnabled?: boolean; telegramChatId?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: Record<string, any> = {};
  if (channels.lineToken !== undefined) updateData.adminLineToken = channels.lineToken;
  if (channels.emailEnabled !== undefined) updateData.adminEmailEnabled = channels.emailEnabled ? "true" : "false";
  if (channels.telegramChatId !== undefined) updateData.adminTelegramChatId = channels.telegramChatId;
  
  return upsertNotificationSettings(userId, updateData);
}

export async function updateUserNotificationPreferences(userId: number, prefs: { emailNotifications?: boolean; notifyOnConfirmed?: boolean; notifyOnCompleted?: boolean; notifyOnCancelled?: boolean; enableScheduledNotifications?: boolean; scheduledMinutesBefore?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: Record<string, any> = {};
  if (prefs.emailNotifications !== undefined) updateData.userEmailNotifications = prefs.emailNotifications ? "true" : "false";
  if (prefs.notifyOnConfirmed !== undefined) updateData.notifyOnConfirmed = prefs.notifyOnConfirmed ? "true" : "false";
  if (prefs.notifyOnCompleted !== undefined) updateData.notifyOnCompleted = prefs.notifyOnCompleted ? "true" : "false";
  if (prefs.notifyOnCancelled !== undefined) updateData.notifyOnCancelled = prefs.notifyOnCancelled ? "true" : "false";
  if (prefs.enableScheduledNotifications !== undefined) updateData.enableScheduledNotifications = prefs.enableScheduledNotifications ? "true" : "false";
  if (prefs.scheduledMinutesBefore !== undefined) updateData.scheduledNotificationMinutesBefore = prefs.scheduledMinutesBefore;
  
  return upsertNotificationSettings(userId, updateData);
}

// Admin Authentication Functions

export async function getAdminByUsername(username: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const admin = await db.select().from(adminCredentials).where(eq(adminCredentials.username, username)).limit(1);
  return admin[0] || null;
}

export async function createAdminCredential(data: InsertAdminCredential) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(adminCredentials).values(data);
  return result;
}

export async function updateAdminLastLogin(adminId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(adminCredentials).set({ lastLogin: new Date() }).where(eq(adminCredentials.id, adminId));
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyAdminPassword(username: string, password: string): Promise<{ id: number; username: string; email: string } | null> {
  const admin = await getAdminByUsername(username);
  if (!admin) return null;
  
  const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
  if (!isPasswordValid) return null;
  if (admin.isActive !== "true") return null;
  
  await updateAdminLastLogin(admin.id);
  
  return {
    id: admin.id,
    username: admin.username,
    email: admin.email,
  };
}


export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const user = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return user[0] || null;
}


export async function sendTelegramNotification(booking: any) {
  const { telegramBotToken, telegramChatId } = ENV;
  
  if (!telegramBotToken || !telegramChatId) {
    console.warn("[Telegram] Bot token or chat ID not configured");
    return false;
  }

  try {
    const message = `
🚕 **New Booking Received**

👤 Name: ${booking.fullName}
📱 Phone: ${booking.phone}
📧 Email: ${booking.email}

📍 Pickup: ${booking.pickupLocation}
📍 Dropoff: ${booking.dropoffLocation}

📅 Date: ${booking.travelDate}
⏰ Time: ${booking.travelTime}
👥 Passengers: ${booking.passengers}
🧳 Luggage: ${booking.luggage}

📞 Contact: ${booking.preferredContactMethod}
${booking.notes ? `📝 Notes: ${booking.notes}` : ''}

Status: ${booking.status}
    `.trim();

    const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[Telegram] Failed to send message:", error);
      return false;
    }

    console.log("[Telegram] Notification sent successfully");
    return true;
  } catch (error) {
    console.error("[Telegram] Error sending notification:", error);
    return false;
  }
}
