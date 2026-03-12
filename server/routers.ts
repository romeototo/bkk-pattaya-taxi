import { COOKIE_NAME } from "@shared/const";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, adminProcedure, adminSessionProcedure } from "./_core/trpc";
import { getSessionCookieOptions } from "./_core/cookies";
import { z } from "zod";
import { createBooking, getBookings, getBookingById, updateBookingStatus, getBookingStats, searchBookings, getNotificationSettings, updateAdminNotificationChannels, updateUserNotificationPreferences, verifyAdminPassword, hashPassword } from "./db";
import { notifyOwner } from "./_core/notification";
import { invokeLLM } from "./_core/llm";

const CHATBOT_SYSTEM_PROMPT = `You are a helpful, friendly customer service assistant for BKK Pattaya Private Taxi — a premium private transfer service operating between Bangkok and Pattaya, Thailand.

Your role is to answer tourist questions about our services, pricing, routes, and general travel information. Be concise, warm, and professional.

KEY INFORMATION:
- Service: Private taxi/transfer service (not shared)
- Routes & Pricing:
  • Bangkok → Pattaya: From ฿1,200
  • Pattaya → Bangkok: From ฿1,200
  • Suvarnabhumi Airport (BKK) → Pattaya: From ฿1,100
  • Don Mueang Airport (DMK) → Pattaya: From ฿1,300
- Vehicles: Toyota Camry, Toyota Innova (for larger groups), and VIP vans
- All prices are FIXED — no hidden charges, no surge pricing, includes tolls and fuel
- 24/7 service available
- Professional, English-speaking, licensed drivers
- Free waiting time for airport pickups (flight monitoring included)
- Meet & greet at arrival hall with name sign
- Trip duration: Bangkok to Pattaya ~1.5-2 hours depending on traffic
- Luggage: Sedans fit 2-3 large suitcases, vans fit up to 8
- Booking: Via WhatsApp (+66 82 982 4986), LINE (@suriwandusit), or the booking form on our website
- Payment: Cash (THB) or bank transfer accepted
- Child seats available upon request (free)
- Day tours available: Coral Island, Nong Nooch Garden, Floating Market

GUIDELINES:
- Always be helpful and encourage booking
- For specific booking requests, guide them to use the booking form or WhatsApp
- If asked about things outside your knowledge, politely say you'll check and suggest they contact us directly
- Keep responses concise (2-4 sentences typically)
- Use a friendly, professional tone
- You can respond in English or Thai based on the user's language`;

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  booking: router({
    create: publicProcedure
      .input(z.object({
        fullName: z.string().min(1, "Full name is required"),
        phone: z.string().min(1, "Phone is required"),
        email: z.string().email("Valid email is required"),
        pickupLocation: z.string().min(1, "Pickup location is required"),
        dropoffLocation: z.string().min(1, "Drop-off location is required"),
        travelDate: z.string().min(1, "Travel date is required"),
        travelTime: z.string().min(1, "Travel time is required"),
        passengers: z.number().min(1).max(15),
        luggage: z.number().min(0).max(20),
        preferredContactMethod: z.enum(["whatsapp", "email", "phone", "line", "telegram"]).default("whatsapp"),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const booking = await createBooking({
          fullName: input.fullName,
          phone: input.phone,
          email: input.email,
          pickupLocation: input.pickupLocation,
          dropoffLocation: input.dropoffLocation,
          travelDate: input.travelDate,
          travelTime: input.travelTime,
          passengers: input.passengers,
          luggage: input.luggage,
          preferredContactMethod: input.preferredContactMethod,
          notes: input.notes,
          status: "pending",
        });

        await notifyOwner({
          title: "New Booking Received",
          content: `New booking from ${input.fullName} (${input.phone}) - ${input.pickupLocation} to ${input.dropoffLocation} on ${input.travelDate}`,
        });

        return booking;
      }),
  }),

  admin: router({
    login: publicProcedure
      .input(z.object({
        username: z.string().min(1, "Username is required"),
        password: z.string().min(1, "Password is required"),
      }))
      .mutation(async ({ input, ctx }) => {
        // Use environment variables for admin credentials
        const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

        // Simple authentication for now (in production, use database + bcrypt)
        if (input.username !== ADMIN_USERNAME || input.password !== ADMIN_PASSWORD) {
          throw new Error("Invalid username or password");
        }

        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie("admin_session", JSON.stringify({ username: input.username, authenticated: true }), {
          ...cookieOptions,
          maxAge: 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });

        return { success: true, message: "Admin login successful" };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie("admin_session", { ...cookieOptions, maxAge: -1 });
      return { success: true };
    }),

    verifySession: publicProcedure.query(({ ctx }) => {
      const adminSession = ctx.req.cookies?.admin_session;
      if (!adminSession) {
        return { authenticated: false };
      }
      try {
        const session = JSON.parse(adminSession);
        return { authenticated: session.authenticated === true, username: session.username };
      } catch (error) {
        return { authenticated: false };
      }
    }),

    bookings: router({
      list: adminSessionProcedure
        .input(z.object({
          query: z.string().optional(),
          status: z.string().optional(),
        }).optional())
        .query(async ({ input }) => {
          if (input?.query) {
            return searchBookings(input.query || "");
          }
          return getBookings();
        }),

      getById: adminSessionProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return getBookingById(input.id);
        }),

      updateStatus: adminSessionProcedure
        .input(z.object({
          id: z.number(),
          status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
        }))
        .mutation(async ({ input }) => {
          const updated = await updateBookingStatus(input.id, input.status);
          return { success: true, booking: updated };
        }),

      stats: adminSessionProcedure.query(async () => {
        return getBookingStats();
      }),
    }),
  }),

  // Notification Settings
  notifications: router({
    getSettings: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return null;
      return getNotificationSettings(ctx.user.id);
    }),

    updateAdminChannels: adminProcedure
      .input(z.object({
        userId: z.number(),
        lineToken: z.string().optional(),
        emailEnabled: z.boolean().optional(),
        telegramChatId: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return updateAdminNotificationChannels(input.userId, {
          lineToken: input.lineToken,
          emailEnabled: input.emailEnabled,
          telegramChatId: input.telegramChatId,
        });
      }),

    updateUserPreferences: publicProcedure
      .input(z.object({
        userId: z.number(),
        emailNotifications: z.boolean().optional(),
        notifyOnConfirmed: z.boolean().optional(),
        notifyOnCompleted: z.boolean().optional(),
        notifyOnCancelled: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        return updateUserNotificationPreferences(input.userId, {
          emailNotifications: input.emailNotifications,
          notifyOnConfirmed: input.notifyOnConfirmed,
          notifyOnCompleted: input.notifyOnCompleted,
          notifyOnCancelled: input.notifyOnCancelled,
        });
      }),
  }),

  // Chatbot
  chatbot: router({
    chat: publicProcedure
      .input(z.object({
        message: z.string().min(1, "Message is required"),
        conversationHistory: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })).optional(),
      }))
      .mutation(async ({ input }) => {
        const messages = [
          { role: "system" as const, content: CHATBOT_SYSTEM_PROMPT },
          ...(input.conversationHistory || []),
          { role: "user" as const, content: input.message },
        ];

        const response = await invokeLLM({
          messages: messages as any,
        });

        const assistantMessage = response.choices[0]?.message?.content || "I'm sorry, I couldn't process your request. Please try again.";

        return {
          message: assistantMessage,
          conversationHistory: [
            ...(input.conversationHistory || []),
            { role: "user" as const, content: input.message },
            { role: "assistant" as const, content: assistantMessage },
          ],
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
