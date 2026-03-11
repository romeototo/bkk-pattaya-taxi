import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createBooking, getBookings } from "./db";
import { notifyOwner } from "./_core/notification";

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
        pickupLocation: z.string().min(1, "Pickup location is required"),
        dropoffLocation: z.string().min(1, "Drop-off location is required"),
        date: z.string().min(1, "Date is required"),
        time: z.string().min(1, "Time is required"),
        passengers: z.number().min(1).max(15),
        luggage: z.number().min(0).max(20),
        contact: z.string().min(1, "Contact information is required"),
        contactMethod: z.enum(["whatsapp", "email", "phone"]).default("whatsapp"),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const booking = await createBooking({
          pickupLocation: input.pickupLocation,
          dropoffLocation: input.dropoffLocation,
          date: input.date,
          time: input.time,
          passengers: input.passengers,
          luggage: input.luggage,
          contact: input.contact,
          contactMethod: input.contactMethod,
          notes: input.notes ?? null,
        });

        // Notify owner about new booking
        try {
          await notifyOwner({
            title: "New Booking Inquiry",
            content: `New booking from ${input.contact} (${input.contactMethod})\n\nRoute: ${input.pickupLocation} → ${input.dropoffLocation}\nDate: ${input.date} at ${input.time}\nPassengers: ${input.passengers}, Luggage: ${input.luggage}\n${input.notes ? `Notes: ${input.notes}` : ""}`,
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
});

export type AppRouter = typeof appRouter;
