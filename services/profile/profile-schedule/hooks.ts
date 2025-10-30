import { useQuery } from "@tanstack/react-query";
import { getBookings, getFilteredBookings } from "./api";
import { ApiBooking, ApiFilteredBooking } from "./types";

export const BOOKINGS_QUERY_KEY = ["bookings"] as const;

export function useBookings() {
  return useQuery<ApiBooking[]>({
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
  return useQuery<ApiFilteredBooking[]>({
    queryKey: key,
    queryFn: () => getFilteredBookings({ fromDate, toDate, type }),
    enabled: Boolean(fromDate && toDate),
  });
}
