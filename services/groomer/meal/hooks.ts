import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFeedingSchedulesByBooking,
  getPendingFeedingSchedules,
  markFeedingScheduleAsFed,
} from "./api";
import type {
  GetFeedingSchedulesByBookingParams,
  GetPendingFeedingSchedulesParams,
  MarkFeedingScheduleAsFedParams,
} from "./type";

export const FEEDING_SCHEDULES_BY_BOOKING_QUERY_KEY = [
  "feeding-schedules-by-booking",
] as const;
export const PENDING_FEEDING_SCHEDULES_QUERY_KEY = [
  "pending-feeding-schedules",
] as const;

export function useGetFeedingSchedulesByBooking(
  params: GetFeedingSchedulesByBookingParams
) {
  return useQuery({
    queryKey: [...FEEDING_SCHEDULES_BY_BOOKING_QUERY_KEY, params.bookingId],
    queryFn: () => getFeedingSchedulesByBooking(params),
    enabled:
      typeof window !== "undefined" &&
      !!localStorage.getItem("accessToken") &&
      !!params.bookingId,
    retry: false,
    staleTime: 30000,
  });
}

export function useGetPendingFeedingSchedules(
  params?: GetPendingFeedingSchedulesParams
) {
  return useQuery({
    queryKey: [...PENDING_FEEDING_SCHEDULES_QUERY_KEY, params?.date],
    queryFn: () => getPendingFeedingSchedules(params),
    enabled:
      typeof window !== "undefined" && !!localStorage.getItem("accessToken"),
    retry: false,
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

export function useMarkFeedingScheduleAsFed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: MarkFeedingScheduleAsFedParams) =>
      markFeedingScheduleAsFed(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: FEEDING_SCHEDULES_BY_BOOKING_QUERY_KEY,
      });
      queryClient.invalidateQueries({
        queryKey: PENDING_FEEDING_SCHEDULES_QUERY_KEY,
      });
    },
    onError: (error) => {
      console.error("Failed to mark feeding schedule as fed:", error);
    },
  });
}
