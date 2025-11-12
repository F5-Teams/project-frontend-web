import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyBookings,
  getConfirmedBookings,
  startBookingOnService,
  uploadBookingPhotos,
  UploadBookingPhotosPayload,
  completeBooking,
  CompleteBookingPayload,
} from "./api";
import { Booking } from "./type";

export const GROOMER_CONFIRMED_BOOKINGS_KEY = [
  "groomer",
  "bookings",
  "confirmed",
] as const;

export const GROOMER_MY_BOOKINGS_KEY = ["groomer", "bookings", "all"] as const;

export function useMyBookings() {
  return useQuery<Booking[]>({
    queryKey: GROOMER_MY_BOOKINGS_KEY,
    queryFn: getMyBookings,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
}

export function useConfirmedBookings() {
  return useQuery<Booking[]>({
    queryKey: GROOMER_CONFIRMED_BOOKINGS_KEY,
    queryFn: getConfirmedBookings,
    staleTime: 1000 * 60 * 30,
  });
}

// Live variant: periodically refetch to keep numbers up-to-date (e.g., dashboards)
export function useConfirmedBookingsLive(intervalMs = 30_000) {
  return useQuery<Booking[]>({
    queryKey: GROOMER_CONFIRMED_BOOKINGS_KEY,
    queryFn: getConfirmedBookings,
    // Treat data as immediately stale so focus refetches run, but interval will handle periodic updates
    staleTime: 0,
    refetchInterval: intervalMs,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });
}

export function useMyBookingsLive(intervalMs = 30_000) {
  return useQuery<Booking[]>({
    queryKey: GROOMER_MY_BOOKINGS_KEY,
    queryFn: getMyBookings,
    staleTime: 0,
    refetchInterval: intervalMs,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });
}

export function useStartOnService(options?: { invalidateOnSuccess?: boolean }) {
  const qc = useQueryClient();
  return useMutation<void, unknown, number>({
    mutationFn: (bookingId: number) => startBookingOnService(bookingId),
    onSuccess: () => {
      if (options?.invalidateOnSuccess !== false) {
        qc.invalidateQueries({ queryKey: GROOMER_CONFIRMED_BOOKINGS_KEY });
      }
    },
  });
}

export function useUploadBookingPhotos() {
  const qc = useQueryClient();
  return useMutation<
    void,
    unknown,
    { bookingId: number; payload: UploadBookingPhotosPayload }
  >({
    mutationFn: ({ bookingId, payload }) =>
      uploadBookingPhotos(bookingId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GROOMER_CONFIRMED_BOOKINGS_KEY });
    },
  });
}

export function useCompleteBooking() {
  const qc = useQueryClient();
  return useMutation<
    void,
    unknown,
    { bookingId: number; payload: CompleteBookingPayload }
  >({
    mutationFn: ({ bookingId, payload }) => completeBooking(bookingId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GROOMER_CONFIRMED_BOOKINGS_KEY });
    },
  });
}
