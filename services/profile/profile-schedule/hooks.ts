import { useQuery } from "@tanstack/react-query";
import { getBookings, getFilteredBookings } from "./api";
import { Booking, CalendarEvent, TIME_SLOTS } from "./types";

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

// màu dịch vụ
export function getBookingColor(booking: Booking): string {
  if (booking.type === "HOTEL") {
    return "bg-violet-500";
  }
  if (booking.type === "SPA") {
    return "bg-teal-500";
  }
  return "bg-blue-500";
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

// chuyển đổi booking thành sự kiện lịch
export function bookingToCalendarEvents(booking: Booking): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  if (booking.slot?.startDate && booking.slot?.endDate) {
    const startDate = new Date(booking.slot.startDate);
    const endDate = new Date(booking.slot.endDate);

    events.push({
      id: booking.id,
      title: getBookingTitle(booking),
      startDate,
      endDate,
      color: getBookingColor(booking),
      type: booking.type,
      status: booking.status,
      booking,
    });
  } else if (booking.bookingDate) {
    const slotInfo =
      TIME_SLOTS[booking.dropDownSlot as keyof typeof TIME_SLOTS] ||
      TIME_SLOTS.MORNING;
    const baseDate = new Date(booking.bookingDate);

    const startDate = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      slotInfo.hour,
      slotInfo.minute,
      0,
      0
    );

    const endDate = new Date(
      startDate.getTime() + slotInfo.duration * 60 * 1000
    );

    events.push({
      id: booking.id,
      title: getBookingTitle(booking),
      startDate,
      endDate,
      color: getBookingColor(booking),
      type: booking.type,
      status: booking.status,
      booking,
    });
  }

  return events;
}

export function bookingsToCalendarEvents(bookings: Booking[]): CalendarEvent[] {
  return bookings.flatMap(bookingToCalendarEvents);
}
