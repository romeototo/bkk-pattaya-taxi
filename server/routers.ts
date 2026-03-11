import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, adminProcedure } from "./_core/trpc";
import { z } from "zod";
import { createBooking, getBookings, getBookingById, updateBookingStatus, getBookingStats, searchBookings, getNotificationSettings, updateAdminNotificationChannels, updateUserNotificationPreferences } from "./db";
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
- Booking: Via WhatsApp (+66 97 172 9666), LINE (@suriwandusit), or the booking form on our website
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
          notes: input.notes ?? null,
        });

        try {
          await notifyOwner({
            title: "New Booking Inquiry",
            content: `New booking from ${input.fullName} (${input.phone})\n\nRoute: ${input.pickupLocation} → ${input.dropoffLocation}\nDate: ${input.travelDate} at ${input.travelTime}\nPassengers: ${input.passengers}, Luggage: ${input.luggage}\nPreferred Contact: ${input.preferredContactMethod}\n${input.notes ? `Notes: ${input.notes}` : ""}`,
          });
        } catch (e) {
          console.error("Failed to notify owner:", e);
        }

        return { success: true, bookingId: booking[0].insertId };
      }),

    list: publicProcedure.query(async () => {
      return getBookings();
    }),
  }),

  // Admin procedures
  admin: router({
    bookings: router({
      list: adminProcedure
        .input(z.object({
          query: z.string().optional(),
          status: z.string().optional(),
        }).optional())
        .query(async ({ input }) => {
          if (input?.query || input?.status) {
            return searchBookings(input.query || "", input.status);
          }
          return getBookings();
        }),

      getById: adminProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return getBookingById(input.id);
        }),

      updateStatus: adminProcedure
        .input(z.object({
          id: z.number(),
          status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
        }))
        .mutation(async ({ input }) => {
          const updated = await updateBookingStatus(input.id, input.status);
          return { success: true, booking: updated };
        }),

      stats: adminProcedure.query(async () => {
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
        lineToken: z.string().optional(),
        emailEnabled: z.boolean().optional(),
        telegramChatId: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const updated = await updateAdminNotificationChannels(ctx.user.id, input);
        return { success: true, settings: updated };
      }),

    updateUserPreferences: publicProcedure
      .input(z.object({
        emailNotifications: z.boolean().optional(),
        notifyOnConfirmed: z.boolean().optional(),
        notifyOnCompleted: z.boolean().optional(),
        notifyOnCancelled: z.boolean().optional(),
        enableScheduledNotifications: z.boolean().optional(),
        scheduledMinutesBefore: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("User not authenticated");
        const updated = await updateUserNotificationPreferences(ctx.user.id, input);
        return { success: true, settings: updated };
      }),
  }),

  // AI Chatbot
  chat: router({
    send: publicProcedure
      .input(z.object({
        messages: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })),
      }))
      .mutation(async ({ input }) => {
        const llmMessages = [
          { role: "system" as const, content: CHATBOT_SYSTEM_PROMPT },
          ...input.messages.map(m => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        ];

        const response = await invokeLLM({ messages: llmMessages });
        const content = response.choices[0]?.message?.content;
        const text = typeof content === "string" ? content : Array.isArray(content) ? content.map(c => 'text' in c ? c.text : '').join('') : '';

        return { reply: text };
      }),
  }),
});

export type AppRouter = typeof appRouter;
