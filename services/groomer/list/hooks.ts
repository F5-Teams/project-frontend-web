import { useQuery } from "@tanstack/react-query";
import { getMyBookings } from "./api";
import { Booking } from "./type";

export const GROOMER_MY_BOOKINGS_KEY = ["groomer", "my-bookings"] as const;

export function useMyBookings() {
  return useQuery<Booking[]>({
    queryKey: GROOMER_MY_BOOKINGS_KEY,
    queryFn: getMyBookings,
    staleTime: 1000 * 60 * 30,
  });
}
