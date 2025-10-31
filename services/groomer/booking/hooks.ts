import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getConfirmedBookings,
  startBookingOnService,
  uploadBookingPhotos,
  UploadBookingPhotosPayload,
} from "./api";
import { Booking } from "./type";

export const GROOMER_CONFIRMED_BOOKINGS_KEY = [
  "groomer",
  "bookings",
  "confirmed",
] as const;

export function useConfirmedBookings() {
  return useQuery<Booking[]>({
    queryKey: GROOMER_CONFIRMED_BOOKINGS_KEY,
    queryFn: getConfirmedBookings,
    staleTime: 1000 * 60 * 30,
  });
}

export function useStartOnService() {
  const qc = useQueryClient();
  return useMutation<void, unknown, number>({
    mutationFn: (bookingId: number) => startBookingOnService(bookingId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GROOMER_CONFIRMED_BOOKINGS_KEY });
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
