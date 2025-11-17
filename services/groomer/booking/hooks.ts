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

export const GROOMER_ON_SERVICE_BOOKINGS_KEY = [
  "groomer",
  "bookings",
  "on-service",
] as const;

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

export function useConfirmedBookingsLive(intervalMs = 30_000) {
  return useQuery<Booking[]>({
    queryKey: GROOMER_CONFIRMED_BOOKINGS_KEY,
    queryFn: getConfirmedBookings,
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

// Only ON_SERVICE bookings (derived from getMyBookings)
export function useOnServiceBookings(options?: {
  live?: boolean;
  intervalMs?: number;
}) {
  const { live = false, intervalMs = 30_000 } = options ?? {};
  return useQuery<Booking[]>({
    queryKey: GROOMER_ON_SERVICE_BOOKINGS_KEY,
    queryFn: getMyBookings,
    select: (data) =>
      data.filter((b) => String(b.status).toUpperCase() === "ON_SERVICE"),
    staleTime: live ? 0 : 1000 * 60 * 5,
    refetchInterval: live ? intervalMs : undefined,
    refetchIntervalInBackground: live || undefined,
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
        qc.invalidateQueries({ queryKey: GROOMER_ON_SERVICE_BOOKINGS_KEY });
        qc.invalidateQueries({ queryKey: GROOMER_MY_BOOKINGS_KEY });
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
      qc.invalidateQueries({ queryKey: GROOMER_ON_SERVICE_BOOKINGS_KEY });
      qc.invalidateQueries({ queryKey: GROOMER_MY_BOOKINGS_KEY });
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
      qc.invalidateQueries({ queryKey: GROOMER_ON_SERVICE_BOOKINGS_KEY });
      qc.invalidateQueries({ queryKey: GROOMER_MY_BOOKINGS_KEY });
    },
  });
}
