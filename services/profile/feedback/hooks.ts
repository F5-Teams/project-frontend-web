import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBookingFeedback, getBookingFeedback } from "./api";
import { CreateFeedbackPayload, BookingFeedback } from "./type";
import { BOOKINGS_QUERY_KEY } from "@/services/profile/profile-schedule/hooks";

const BOOKING_DETAIL_QUERY_KEY = ["booking-detail"];

export function useCreateBookingFeedback() {
  const qc = useQueryClient();
  return useMutation<
    void,
    unknown,
    { bookingId: number; payload: CreateFeedbackPayload }
  >({
    mutationFn: ({ bookingId, payload }) =>
      createBookingFeedback(bookingId, payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY });
      qc.invalidateQueries({
        queryKey: ["booking-feedback", variables.bookingId],
      });
      qc.invalidateQueries({
        queryKey: [...BOOKING_DETAIL_QUERY_KEY, variables.bookingId],
      });
    },
  });
}

export function useGetBookingFeedback(bookingId: number | null | undefined) {
  return useQuery<BookingFeedback | null>({
    queryKey: ["booking-feedback", bookingId ?? 0],
    queryFn: () => getBookingFeedback(Number(bookingId)),
    enabled: typeof bookingId === "number" && bookingId > 0,
  });
}
