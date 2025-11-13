import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBookingFeedback,
  CreateFeedbackPayload,
  getBookingFeedback,
  BookingFeedback,
} from "./api";
import { BOOKINGS_QUERY_KEY } from "@/services/profile/profile-schedule/hooks";

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
      // Invalidate bookings so any flags like hasFeedback/canLeaveFeedback refresh
      qc.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY });
      // Invalidate per-booking feedback cache so UI hides the button immediately
      qc.invalidateQueries({
        queryKey: ["booking-feedback", variables.bookingId],
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
