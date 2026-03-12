import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  CalendarDays, Clock, MapPin, Navigation, Users, Luggage,
  Phone, MessageCircle, Mail, Search, FileText, CheckCircle,
  XCircle, Loader2, BarChart3, TrendingUp, AlertCircle, Eye
} from "lucide-react";
import { useState, useMemo } from "react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="w-3.5 h-3.5" />,
  confirmed: <CheckCircle className="w-3.5 h-3.5" />,
  completed: <CheckCircle className="w-3.5 h-3.5" />,
  cancelled: <XCircle className="w-3.5 h-3.5" />,
};

const contactIcons: Record<string, React.ReactNode> = {
  whatsapp: <MessageCircle className="w-4 h-4 text-green-500" />,
  email: <Mail className="w-4 h-4 text-blue-500" />,
  phone: <Phone className="w-4 h-4 text-primary" />,
};

function StatsCards() {
  const { data: stats, isLoading } = trpc.admin.bookings.stats.useQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded w-16 mb-2" />
              <div className="h-8 bg-muted rounded w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    { label: "Total Bookings", value: stats?.total ?? 0, icon: <BarChart3 className="w-5 h-5" />, color: "text-primary" },
    { label: "Pending", value: stats?.pending ?? 0, icon: <Clock className="w-5 h-5" />, color: "text-yellow-500" },
    { label: "Confirmed", value: stats?.confirmed ?? 0, icon: <CheckCircle className="w-5 h-5" />, color: "text-blue-500" },
    { label: "Completed", value: stats?.completed ?? 0, icon: <CheckCircle className="w-5 h-5" />, color: "text-green-500" },
    { label: "Cancelled", value: stats?.cancelled ?? 0, icon: <XCircle className="w-5 h-5" />, color: "text-red-500" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {statItems.map((item) => (
        <Card key={item.label}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
              <span className={item.color}>{item.icon}</span>
            </div>
            <p className="text-2xl font-bold">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

type BookingType = {
  id: number;
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
  notes: string | null;
  status: string;
  notificationsSent: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function BookingDetailDialog({ booking }: { booking: BookingType }) {
  const utils = trpc.useUtils();
  const updateStatus = trpc.admin.bookings.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Booking status updated");
      utils.admin.bookings.list.invalidate();
      utils.admin.bookings.stats.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Booking #{booking.id}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Badge variant="outline" className={statusColors[booking.status]}>
            {statusIcons[booking.status]}
            <span className="ml-1 capitalize">{booking.status}</span>
          </Badge>
        </div>

        <Separator />

        <div className="grid gap-3">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Pickup</p>
              <p className="text-sm font-medium">{booking.pickupLocation}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Navigation className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Drop-off</p>
              <p className="text-sm font-medium">{booking.dropoffLocation}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="text-sm font-medium">{booking.travelDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="text-sm font-medium">{booking.travelTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Passengers</p>
              <p className="text-sm font-medium">{booking.passengers}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Luggage className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Luggage</p>
              <p className="text-sm font-medium">{booking.luggage}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex items-center gap-3">
          {contactIcons[booking.preferredContactMethod]}
          <div>
            <p className="text-xs text-muted-foreground capitalize">{booking.preferredContactMethod}</p>
            <p className="text-sm font-medium">{booking.phone} • {booking.email}</p>
          </div>
        </div>

        {booking.notes && (
          <>
            <Separator />
            <div>
              <p className="text-xs text-muted-foreground mb-1">Notes</p>
              <p className="text-sm bg-muted/50 rounded-lg p-3">{booking.notes}</p>
            </div>
          </>
        )}

        <Separator />

        <div>
          <p className="text-xs text-muted-foreground mb-2">Update Status</p>
          <div className="flex flex-wrap gap-2">
            {(["pending", "confirmed", "completed", "cancelled"] as const).map((status) => (
              <Button
                key={status}
                variant={booking.status === status ? "default" : "outline"}
                size="sm"
                disabled={booking.status === status || updateStatus.isPending}
                onClick={() => updateStatus.mutate({ id: booking.id, status })}
                className="capitalize"
              >
                {updateStatus.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : statusIcons[status]}
                <span className="ml-1">{status}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Created: {new Date(booking.createdAt).toLocaleString()}
        </div>
      </div>
    </DialogContent>
  );
}

function BookingsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: bookings, isLoading } = trpc.admin.bookings.list.useQuery({
    query: searchQuery || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const utils = trpc.useUtils();
  const updateStatus = trpc.admin.bookings.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status updated");
      utils.admin.bookings.list.invalidate();
      utils.admin.bookings.stats.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by location, contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : !bookings || bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <AlertCircle className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm">No bookings found</p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-340px)]">
          <div className="space-y-3">
            {bookings.map((booking) => (
              <Card key={booking.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs text-muted-foreground font-mono">#{booking.id}</span>
                        <Badge variant="outline" className={`text-xs ${statusColors[booking.status]}`}>
                          {statusIcons[booking.status]}
                          <span className="ml-1 capitalize">{booking.status}</span>
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {booking.travelDate} at {booking.travelTime}
                        </span>
                      </div>
                      <p className="text-sm font-medium truncate">
                        <span className="text-green-500">●</span> {booking.pickupLocation}
                        <span className="text-muted-foreground mx-2">→</span>
                        <span className="text-red-500">●</span> {booking.dropoffLocation}
                      </p>
                      <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          {contactIcons[booking.preferredContactMethod]}
                          {booking.fullName} • {booking.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> {booking.passengers}
                        </span>
                        <span className="flex items-center gap-1">
                          <Luggage className="w-3 h-3" /> {booking.luggage}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {booking.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-500 border-blue-500/30 hover:bg-blue-500/10"
                          onClick={() => updateStatus.mutate({ id: booking.id, status: "confirmed" })}
                          disabled={updateStatus.isPending}
                        >
                          <CheckCircle className="w-3.5 h-3.5 mr-1" />
                          Confirm
                        </Button>
                      )}
                      {booking.status === "confirmed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-500 border-green-500/30 hover:bg-green-500/10"
                          onClick={() => updateStatus.mutate({ id: booking.id, status: "completed" })}
                          disabled={updateStatus.isPending}
                        >
                          <CheckCircle className="w-3.5 h-3.5 mr-1" />
                          Complete
                        </Button>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <BookingDetailDialog booking={booking} />
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Booking Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all booking inquiries, update statuses, and track performance.
          </p>
        </div>

        <StatsCards />

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              All Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BookingsList />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
