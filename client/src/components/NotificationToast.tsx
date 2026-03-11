import { useEffect } from "react";
import { toast } from "sonner";
import { CheckCircle2, AlertCircle, XCircle, Clock } from "lucide-react";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface NotificationData {
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

const notificationIcons = {
  success: CheckCircle2,
  error: XCircle,
  info: AlertCircle,
  warning: Clock,
};

export function showNotification(data: NotificationData) {
  const Icon = notificationIcons[data.type];
  const duration = data.duration || 4000;

  const content = (
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-semibold text-sm">{data.title}</p>
        <p className="text-sm opacity-90">{data.message}</p>
      </div>
    </div>
  );

  if (data.type === "success") {
    toast.success(content, { duration });
  } else if (data.type === "error") {
    toast.error(content, { duration });
  } else if (data.type === "warning") {
    toast.warning(content, { duration });
  } else {
    toast.info(content, { duration });
  }
}

// Hook for booking notifications
export function useBookingNotifications() {
  return {
    notifyBookingCreated: () => showNotification({
      type: "success",
      title: "Booking Created",
      message: "Your booking has been submitted. We'll confirm it shortly via WhatsApp.",
    }),
    notifyBookingConfirmed: () => showNotification({
      type: "success",
      title: "Booking Confirmed",
      message: "Your driver has been assigned. Check your messages for details.",
    }),
    notifyBookingCompleted: () => showNotification({
      type: "success",
      title: "Trip Completed",
      message: "Thank you for using BKK Pattaya Taxi! Please rate your experience.",
    }),
    notifyBookingCancelled: () => showNotification({
      type: "warning",
      title: "Booking Cancelled",
      message: "Your booking has been cancelled.",
    }),
    notifyBookingError: (error: string) => showNotification({
      type: "error",
      title: "Booking Error",
      message: error || "Failed to create booking. Please try again.",
    }),
    notifyReminder: (timeUntil: string) => showNotification({
      type: "info",
      title: "Trip Reminder",
      message: `Your trip starts in ${timeUntil}. Make sure you're ready!`,
    }),
  };
}
