import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Download, Search, Filter, Phone, MapPin, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";

type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

interface Booking {
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
  notes?: string | null;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

const statusColors: Record<BookingStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminDashboardPro() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Handle delete booking
  const handleDeleteBooking = async (bookingId: number) => {
    // Note: Delete functionality needs to be added to the backend
    toast.error("Delete functionality coming soon");
  };

  // Fetch bookings
  const { data: bookings = [], isLoading } = trpc.admin.bookings.list.useQuery();
  const updateStatusMutation = trpc.admin.bookings.updateStatus.useMutation();
  const statsMutation = trpc.admin.bookings.stats.useQuery();

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phone.includes(searchTerm) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter((b: Booking) => b.status === "pending").length,
      confirmed: bookings.filter((b: Booking) => b.status === "confirmed").length,
      completed: bookings.filter((b: Booking) => b.status === "completed").length,
      cancelled: bookings.filter((b: Booking) => b.status === "cancelled").length,
    };
  }, [bookings]);

  // Handle status update
  const handleStatusUpdate = async (bookingId: number, newStatus: BookingStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: bookingId,
        status: newStatus,
      });
      toast.success(`Booking status updated to ${newStatus}`);
      setIsDetailOpen(false);
    } catch (error) {
      toast.error("Failed to update booking status");
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Phone",
      "Email",
      "Pickup",
      "Dropoff",
      "Date",
      "Time",
      "Passengers",
      "Luggage",
      "Contact Method",
      "Status",
      "Created At",
    ];

    const rows = filteredBookings.map((booking: Booking) => [
      booking.id,
      booking.fullName,
      booking.phone,
      booking.email,
      booking.pickupLocation,
      booking.dropoffLocation,
      booking.travelDate,
      booking.travelTime,
      booking.passengers,
      booking.luggage,
      booking.preferredContactMethod,
      booking.status,
      new Date(booking.createdAt).toISOString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row: any[]) =>
        row
          .map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `bookings-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV exported successfully");
  };



  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Booking Management</h1>
            <p className="text-gray-500 mt-2">
              Manage all taxi bookings and customer inquiries
            </p>
          </div>
          <Button onClick={handleExportCSV} className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.confirmed}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.completed}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.cancelled}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as BookingStatus | "all")
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
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

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Bookings ({filteredBookings.length})</CardTitle>
            <CardDescription>
              Showing {filteredBookings.length} of {bookings.length} bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading bookings...</div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No bookings found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Trip</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking: Booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">
                          {booking.fullName}
                        </TableCell>
                        <TableCell>{booking.phone}</TableCell>
                        <TableCell className="text-sm">
                          <div>{booking.pickupLocation}</div>
                          <div className="text-gray-500">→</div>
                          <div>{booking.dropoffLocation}</div>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div>{booking.travelDate}</div>
                          <div className="text-gray-500">{booking.travelTime}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[booking.status as BookingStatus]}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setIsDetailOpen(true);
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Booking Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              View and manage booking information
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              {/* Passenger Info */}
              <div>
                <h3 className="font-semibold mb-2">Passenger Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <p className="font-medium">{selectedBooking.fullName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <p className="font-medium">{selectedBooking.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="font-medium">{selectedBooking.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Contact Method:</span>
                    <p className="font-medium">
                      {selectedBooking.preferredContactMethod}
                    </p>
                  </div>
                </div>
              </div>

              {/* Trip Info */}
              <div>
                <h3 className="font-semibold mb-2">Trip Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Pickup:</span>
                    <p className="font-medium">{selectedBooking.pickupLocation}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Dropoff:</span>
                    <p className="font-medium">{selectedBooking.dropoffLocation}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Date:</span>
                    <p className="font-medium">{selectedBooking.travelDate}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Time:</span>
                    <p className="font-medium">{selectedBooking.travelTime}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Passengers:</span>
                    <p className="font-medium">{selectedBooking.passengers}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Luggage:</span>
                    <p className="font-medium">{selectedBooking.luggage}</p>
                  </div>
                </div>
              </div>

              {selectedBooking.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-sm text-gray-700">{selectedBooking.notes}</p>
                </div>
              )}

              {/* Status Update */}
              <div>
                <h3 className="font-semibold mb-2">Update Status</h3>
                <div className="flex gap-2">
                  {(["pending", "confirmed", "completed", "cancelled"] as BookingStatus[]).map(
                    (status) => (
                      <Button
                        key={status}
                        variant={
                          selectedBooking.status === status
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          handleStatusUpdate(selectedBooking.id, status)
                        }
                        disabled={updateStatusMutation.isPending}
                      >
                        {status}
                      </Button>
                    )
                  )}
                </div>
              </div>

              {/* Delete Button */}
              <div className="flex justify-end">
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteBooking(selectedBooking.id)}
                  >
                    Delete Booking
                  </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
