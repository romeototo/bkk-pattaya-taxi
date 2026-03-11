import nodemailer from "nodemailer";
import { ENV } from "../_core/env";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!ENV.smtpHost || !ENV.smtpUser || !ENV.smtpPassword) {
    console.warn("[Email] SMTP credentials not configured");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: ENV.smtpHost,
    port: ENV.smtpPort,
    secure: ENV.smtpPort === 465,
    auth: {
      user: ENV.smtpUser,
      pass: ENV.smtpPassword,
    },
  });

  return transporter;
}

export async function sendBookingConfirmationEmail(
  to: string,
  booking: {
    fullName: string;
    phone: string;
    email: string;
    pickupLocation: string;
    dropoffLocation: string;
    travelDate: string;
    travelTime: string;
    passengers: number;
    luggage: number;
    preferredContactMethod: string;
    notes?: string;
  }
) {
  try {
    const mailer = getTransporter();
    if (!mailer) {
      return { success: false, error: "Email not configured" };
    }

    const htmlContent = `
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Booking Confirmation</h2>
    <p>Dear ${booking.fullName},</p>
    <p>Thank you for booking with BKK Pattaya Private Taxi. Here are your booking details:</p>
    
    <h3>Trip Details</h3>
    <ul>
      <li><strong>Pickup:</strong> ${booking.pickupLocation}</li>
      <li><strong>Dropoff:</strong> ${booking.dropoffLocation}</li>
      <li><strong>Date:</strong> ${booking.travelDate}</li>
      <li><strong>Time:</strong> ${booking.travelTime}</li>
      <li><strong>Passengers:</strong> ${booking.passengers}</li>
      <li><strong>Luggage:</strong> ${booking.luggage}</li>
    </ul>

    <h3>Your Contact Information</h3>
    <ul>
      <li><strong>Phone:</strong> ${booking.phone}</li>
      <li><strong>Email:</strong> ${booking.email}</li>
      <li><strong>Preferred Contact:</strong> ${booking.preferredContactMethod}</li>
    </ul>

    ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ""}

    <p>We will contact you shortly to confirm your booking. If you have any questions, please don't hesitate to reach out.</p>

    <p>Best regards,<br/>BKK Pattaya Private Taxi Team</p>
  </body>
</html>
    `.trim();

    await mailer.sendMail({
      from: ENV.smtpUser,
      to,
      subject: "Booking Confirmation - BKK Pattaya Private Taxi",
      html: htmlContent,
    });

    console.log("[Email] Confirmation email sent successfully");
    return { success: true };
  } catch (error) {
    console.error("[Email] Error sending email:", error);
    return { success: false, error: String(error) };
  }
}

export async function sendAdminNotificationEmail(
  to: string,
  booking: {
    fullName: string;
    phone: string;
    email: string;
    pickupLocation: string;
    dropoffLocation: string;
    travelDate: string;
    travelTime: string;
    passengers: number;
    luggage: number;
    preferredContactMethod: string;
    notes?: string;
  }
) {
  try {
    const mailer = getTransporter();
    if (!mailer) {
      return { success: false, error: "Email not configured" };
    }

    const htmlContent = `
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>New Booking Received</h2>
    
    <h3>Passenger Details</h3>
    <ul>
      <li><strong>Name:</strong> ${booking.fullName}</li>
      <li><strong>Phone:</strong> ${booking.phone}</li>
      <li><strong>Email:</strong> ${booking.email}</li>
    </ul>

    <h3>Trip Details</h3>
    <ul>
      <li><strong>Pickup:</strong> ${booking.pickupLocation}</li>
      <li><strong>Dropoff:</strong> ${booking.dropoffLocation}</li>
      <li><strong>Date:</strong> ${booking.travelDate}</li>
      <li><strong>Time:</strong> ${booking.travelTime}</li>
      <li><strong>Passengers:</strong> ${booking.passengers}</li>
      <li><strong>Luggage:</strong> ${booking.luggage}</li>
    </ul>

    <h3>Contact Method</h3>
    <p>${booking.preferredContactMethod}</p>

    ${booking.notes ? `<h3>Notes</h3><p>${booking.notes}</p>` : ""}

    <p>Please log in to the admin dashboard to confirm or reject this booking.</p>
  </body>
</html>
    `.trim();

    await mailer.sendMail({
      from: ENV.smtpUser,
      to,
      subject: `New Booking: ${booking.fullName} - ${booking.travelDate}`,
      html: htmlContent,
    });

    console.log("[Email] Admin notification sent successfully");
    return { success: true };
  } catch (error) {
    console.error("[Email] Error sending admin notification:", error);
    return { success: false, error: String(error) };
  }
}
