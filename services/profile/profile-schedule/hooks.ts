import { useQuery } from "@tanstack/react-query";
import { getBookings, getFilteredBookings } from "./api";
import { Booking } from "./types";

export const BOOKINGS_QUERY_KEY = ["bookings"] as const;

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
