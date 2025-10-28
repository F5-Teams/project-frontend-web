import { useQuery } from "@tanstack/react-query";
import { getBookings } from "./api";
import { ApiBooking } from "./types";

export const BOOKINGS_QUERY_KEY = ["bookings"] as const;

export function useBookings() {
  return useQuery<ApiBooking[]>({
    queryKey: BOOKINGS_QUERY_KEY,
    queryFn: getBookings,
  });
}
