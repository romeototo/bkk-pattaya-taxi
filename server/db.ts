import { eq, desc, sql, like, or, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, bookings, InsertBooking } from "../drizzle/schema";
import { ENV } from './_core/env';

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
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Booking helpers
export async function createBooking(booking: InsertBooking) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  const result = await db.insert(bookings).values(booking);
  return result;
}

export async function getBookings() {
  const db = await getDb();
  if (!db) {
    return [];
  }
  return db.select().from(bookings).orderBy(desc(bookings.createdAt));
}

export async function getBookingById(id: number) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }
  const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Admin booking helpers
export async function updateBookingStatus(id: number, status: "pending" | "confirmed" | "completed" | "cancelled") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(bookings).set({ status }).where(eq(bookings.id, id));
  return getBookingById(id);
}

export async function getBookingStats() {
  const db = await getDb();
  if (!db) return { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, today: 0 };

  const allBookings = await db.select().from(bookings);
  const today = new Date().toISOString().split("T")[0];

  return {
    total: allBookings.length,
    pending: allBookings.filter(b => b.status === "pending").length,
    confirmed: allBookings.filter(b => b.status === "confirmed").length,
    completed: allBookings.filter(b => b.status === "completed").length,
    cancelled: allBookings.filter(b => b.status === "cancelled").length,
    today: allBookings.filter(b => b.date === today).length,
  };
}

export async function searchBookings(query: string, statusFilter?: string) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];

  if (query && query.trim()) {
    const searchTerm = `%${query.trim()}%`;
    conditions.push(
      or(
        like(bookings.pickupLocation, searchTerm),
        like(bookings.dropoffLocation, searchTerm),
        like(bookings.contact, searchTerm),
      )
    );
  }

  if (statusFilter && statusFilter !== "all") {
    conditions.push(eq(bookings.status, statusFilter as "pending" | "confirmed" | "completed" | "cancelled"));
  }

  if (conditions.length === 0) {
    return db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }

  return db.select().from(bookings)
    .where(conditions.length === 1 ? conditions[0] : and(...conditions))
    .orderBy(desc(bookings.createdAt));
}
