import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function NotificationSettings() {
  const { data: settings, isLoading } = trpc.notifications.getSettings.useQuery();
  const updateAdminChannels = trpc.notifications.updateAdminChannels.useMutation();
  const updateUserPreferences = trpc.notifications.updateUserPreferences.useMutation();

  const [lineToken, setLineToken] = useState(settings?.adminLineToken || "");
  const [emailEnabled, setEmailEnabled] = useState(settings?.adminEmailEnabled === "true");
  const [telegramChatId, setTelegramChatId] = useState(settings?.adminTelegramChatId || "");
  const [emailNotifications, setEmailNotifications] = useState(settings?.userEmailNotifications === "true");
  const [notifyOnConfirmed, setNotifyOnConfirmed] = useState(settings?.notifyOnConfirmed === "true");
  const [notifyOnCompleted, setNotifyOnCompleted] = useState(settings?.notifyOnCompleted === "true");
  const [notifyOnCancelled, setNotifyOnCancelled] = useState(settings?.notifyOnCancelled === "true");
  const [enableScheduled, setEnableScheduled] = useState(settings?.enableScheduledNotifications === "true");
  const [scheduledMinutes, setScheduledMinutes] = useState(settings?.scheduledNotificationMinutesBefore || 60);

  const handleSaveAdminChannels = async () => {
    try {
      await updateAdminChannels.mutateAsync({
        lineToken: lineToken || undefined,
        emailEnabled,
        telegramChatId: telegramChatId || undefined,
      });
      toast.success("Admin notification channels updated");
    } catch (error) {
      toast.error("Failed to update admin channels");
    }
  };

  const handleSaveUserPreferences = async () => {
    try {
      await updateUserPreferences.mutateAsync({
        emailNotifications,
        notifyOnConfirmed,
        notifyOnCompleted,
        notifyOnCancelled,
        enableScheduledNotifications: enableScheduled,
        scheduledMinutesBefore: scheduledMinutes,
      });
      toast.success("User notification preferences updated");
    } catch (error) {
      toast.error("Failed to update preferences");
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Admin Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Notification Channels</CardTitle>
          <CardDescription>Configure how you receive booking notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* LINE */}
          <div className="space-y-2">
            <Label htmlFor="lineToken">LINE Bot Token</Label>
            <Input
              id="lineToken"
              placeholder="Enter your LINE bot token"
              value={lineToken}
              onChange={(e) => setLineToken(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Get your LINE bot token from LINE Developers Console</p>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-xs text-muted-foreground">Receive booking alerts via email</p>
            </div>
            <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
          </div>

          {/* Telegram */}
          <div className="space-y-2">
            <Label htmlFor="telegramChatId">Telegram Chat ID</Label>
            <Input
              id="telegramChatId"
              placeholder="Enter your Telegram chat ID"
              value={telegramChatId}
              onChange={(e) => setTelegramChatId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Get your chat ID by messaging @userinfobot on Telegram</p>
          </div>

          <Button onClick={handleSaveAdminChannels} disabled={updateAdminChannels.isPending}>
            {updateAdminChannels.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Admin Channels
          </Button>
        </CardContent>
      </Card>

      {/* User Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Notification Preferences</CardTitle>
          <CardDescription>Choose when and how you want to receive booking updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-xs text-muted-foreground">Receive booking updates via email</p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>

          {/* Notify on Status Changes */}
          <div className="space-y-3 border-t pt-4">
            <Label>Notify me when booking is:</Label>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Confirmed</p>
                <p className="text-xs text-muted-foreground">When driver accepts the booking</p>
              </div>
              <Switch checked={notifyOnConfirmed} onCheckedChange={setNotifyOnConfirmed} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-xs text-muted-foreground">When trip is finished</p>
              </div>
              <Switch checked={notifyOnCompleted} onCheckedChange={setNotifyOnCompleted} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Cancelled</p>
                <p className="text-xs text-muted-foreground">If booking is cancelled</p>
              </div>
              <Switch checked={notifyOnCancelled} onCheckedChange={setNotifyOnCancelled} />
            </div>
          </div>

          {/* Scheduled Notifications */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Reminder Notification</Label>
                <p className="text-xs text-muted-foreground">Get notified before your trip</p>
              </div>
              <Switch checked={enableScheduled} onCheckedChange={setEnableScheduled} />
            </div>

            {enableScheduled && (
              <div className="space-y-2 ml-4">
                <Label htmlFor="scheduledMinutes">Minutes before trip</Label>
                <Input
                  id="scheduledMinutes"
                  type="number"
                  min="15"
                  max="1440"
                  value={scheduledMinutes}
                  onChange={(e) => setScheduledMinutes(parseInt(e.target.value))}
                />
              </div>
            )}
          </div>

          <Button onClick={handleSaveUserPreferences} disabled={updateUserPreferences.isPending}>
            {updateUserPreferences.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
