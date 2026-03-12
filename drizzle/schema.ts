import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  pickupLocation: varchar("pickupLocation", { length: 500 }).notNull(),
  dropoffLocation: varchar("dropoffLocation", { length: 500 }).notNull(),
  travelDate: varchar("travelDate", { length: 20 }).notNull(),
  travelTime: varchar("travelTime", { length: 10 }).notNull(),
  passengers: int("passengers").notNull(),
  luggage: int("luggage").notNull(),
  preferredContactMethod: mysqlEnum("preferredContactMethod", ["whatsapp", "email", "phone", "line", "telegram"]).default("whatsapp").notNull(),
  notes: text("notes"),
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).default("pending").notNull(),
  notificationsSent: text("notificationsSent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

export const notificationSettings = mysqlTable("notificationSettings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  // Admin notification channels
  adminLineToken: varchar("adminLineToken", { length: 500 }),
  adminEmailEnabled: mysqlEnum("adminEmailEnabled", ["true", "false"]).default("true").notNull(),
  adminTelegramChatId: varchar("adminTelegramChatId", { length: 100 }),
  // User notification preferences
  userEmailNotifications: mysqlEnum("userEmailNotifications", ["true", "false"]).default("true").notNull(),
  notifyOnConfirmed: mysqlEnum("notifyOnConfirmed", ["true", "false"]).default("true").notNull(),
  notifyOnCompleted: mysqlEnum("notifyOnCompleted", ["true", "false"]).default("true").notNull(),
  notifyOnCancelled: mysqlEnum("notifyOnCancelled", ["true", "false"]).default("true").notNull(),
  // Scheduled notifications
  enableScheduledNotifications: mysqlEnum("enableScheduledNotifications", ["true", "false"]).default("true").notNull(),
  scheduledNotificationMinutesBefore: int("scheduledNotificationMinutesBefore").default(60).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NotificationSettings = typeof notificationSettings.$inferSelect;
export type InsertNotificationSettings = typeof notificationSettings.$inferInsert;

export const adminCredentials = mysqlTable("adminCredentials", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  isActive: mysqlEnum("isActive", ["true", "false"]).default("true").notNull(),
  lastLogin: timestamp("lastLogin"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdminCredential = typeof adminCredentials.$inferSelect;
export type InsertAdminCredential = typeof adminCredentials.$inferInsert;
