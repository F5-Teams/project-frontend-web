import { useQuery } from "@tanstack/react-query";
import { getBookings, getFilteredBookings, getBookingById } from "./api";
import { Booking } from "./types";

export const BOOKINGS_QUERY_KEY = ["bookings"] as const;
export const BOOKING_DETAIL_QUERY_KEY = ["booking", "detail"] as const;

export function useBookings() {
  return useQuery<Booking[]>({
    queryKey: BOOKINGS_QUERY_KEY,
    queryFn: getBookings,
  });
}

export function useFilteredBookings(params: {
  fromDate: string;
  toDate: string;
  type?: string;
}) {
  const { fromDate, toDate, type } = params;
  const key = ["bookings", "filter", fromDate, toDate, type] as const;
  return useQuery<Booking[]>({
    queryKey: key,
    queryFn: () => getFilteredBookings({ fromDate, toDate, type }),
    enabled: Boolean(fromDate && toDate),
  });
}

export function useBookingById(id: number | null) {
  return useQuery<Booking>({
    queryKey: [...BOOKING_DETAIL_QUERY_KEY, id],
    queryFn: () => getBookingById(id!),
    enabled: id !== null,
  });
}

// tên booking
export function getBookingTitle(booking: Booking): string {
  if (booking.combo) {
    return booking.combo.name;
  }
  if (booking.room) {
    return booking.room.name;
  }
  return `Booking #${booking.bookingCode}`;
}

// chuyển status sang tiếng Việt
export function getBookingStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: "Đang chờ",
    CONFIRMED: "Đã xác nhận",
    CANCELLED: "Đã hủy",
    ON_SERVICE: "Đang phục vụ",
    COMPLETED: "Đã hoàn thành",
  };
  return statusMap[status] || status;
}

// màu cho status
export function getBookingStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    PENDING: "text-yellow-600",
    CONFIRMED: "text-green-600",
    CANCELLED: "text-red-600",
    ON_SERVICE: "text-blue-600",
    COMPLETED: "text-emerald-600",
  };
  return colorMap[status] || "text-gray-600";
}
